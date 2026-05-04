import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:path/path.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class VaultService {
  static final String _goServerUrl =
      dotenv.env['GO_SERVER_URL'] ?? 'http://localhost:8080/upload';
  static Future<String> uploadToVault(File file) async {
    try {
      var request = http.MultipartRequest('POST', Uri.parse(_goServerUrl));

      var stream = http.ByteStream(file.openRead());
      var length = await file.length();

      var multipartFile = http.MultipartFile(
        'file',
        stream,
        length,
        filename: basename(file.path),
      );

      request.files.add(multipartFile);

      var response = await request.send();

      var responseData = await response.stream.bytesToString();

      if (response.statusCode == 200) {
        return "SUCCESS: $responseData";
      } else {
        return "BLOCKED: $responseData";
      }
    } catch (e) {
      return "ERROR: Could not reach the Vault server.";
    }
  }
}
