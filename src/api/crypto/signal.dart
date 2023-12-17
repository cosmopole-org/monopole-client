import 'package:args/args.dart';
import 'package:libsignal_protocol_dart/libsignal_protocol_dart.dart';
import 'dart:convert';
import 'dart:typed_data';

const String version = '0.0.1';

Future<void> install() async {
  final identityKeyPair = generateIdentityKeyPair();
  final registrationId = generateRegistrationId(false);
  final preKeys = generatePreKeys(0, 110);
  final signedPreKey = generateSignedPreKey(identityKeyPair, 0);
  final sessionStore = InMemorySessionStore();
  final preKeyStore = InMemoryPreKeyStore();
  final signedPreKeyStore = InMemorySignedPreKeyStore();
  final identityStore =
  InMemoryIdentityKeyStore(identityKeyPair, registrationId);
  for (var p in preKeys) {
    await preKeyStore.storePreKey(p.id, p);
  }
  await signedPreKeyStore.storeSignedPreKey(signedPreKey.id, signedPreKey);
}

class EncryptedData {
  EncryptedData(this.encrypted, this.distributionMessage);
  Uint8List encrypted;
  Uint8List distributionMessage;
}

Future<EncryptedData> encrypt(String groupId, String authorId, String data) async {
  var alice = SignalProtocolAddress(authorId, 1);
  var groupSender = SenderKeyName(groupId, alice);
  var aliceStore = InMemorySenderKeyStore();
  var aliceSessionBuilder = GroupSessionBuilder(aliceStore);
  var sentAliceDistributionMessage = await aliceSessionBuilder.create(groupSender);
  var distributionMessage = sentAliceDistributionMessage.serialize();
  var aliceGroupCipher = GroupCipher(aliceStore, groupSender);
  var ciphertextFromAlice = await aliceGroupCipher.encrypt(Uint8List.fromList(utf8.encode(data)));
  return EncryptedData(ciphertextFromAlice, distributionMessage);
}

Future<String> decrypt(String groupId, String authorId, Uint8List distributionMessage, Uint8List encrypted) async {
  var alice = SignalProtocolAddress(authorId, 1);
  var groupSender = SenderKeyName(groupId, alice);
  var bobStore = InMemorySenderKeyStore();
  var bobSessionBuilder = GroupSessionBuilder(bobStore);
  var bobGroupCipher = GroupCipher(bobStore, groupSender);
  var receivedAliceDistributionMessage = SenderKeyDistributionMessageWrapper.fromSerialized(distributionMessage);
  await bobSessionBuilder.process(groupSender, receivedAliceDistributionMessage);
  var plaintextFromAlice = await bobGroupCipher.decrypt(encrypted);
  return utf8.decode(plaintextFromAlice);
}

void main(List<String> arguments) async {
  String myId = '+00000000001';
  String groupId = 'School';
  try {
    install();
    var encedData = await encrypt(groupId, myId, 'hello world !');
    var decrypted = await decrypt(groupId, myId, encedData.distributionMessage, encedData.encrypted);
    print(decrypted);
  } on FormatException catch (e) {
    print(e.message);
    print('');
  }
}
