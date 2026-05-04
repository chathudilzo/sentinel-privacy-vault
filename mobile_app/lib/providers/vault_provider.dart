import 'dart:io';
import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:mobile_app/services/vault_service.dart';

class VaultProvider extends ChangeNotifier {
  String _statusMessage = "AWAITING SECURE UPLOAD";
  bool _isUploading = false;
  Color _statusColor = Colors.cyanAccent;

  String get statusMessage => _statusMessage;
  bool get isUploading => _isUploading;
  Color get statusColor => _statusColor;

  Future<void> pickAndUploadFile() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles();

    if (result != null) {
      File file = File(result.files.single.path!);

      _isUploading = true;
      _statusMessage = "TRANSMITTING TO VAULT...";
      _statusColor = Colors.purpleAccent;
      notifyListeners();

      String response = await VaultService.uploadToVault(file);

      _isUploading = false;
      _statusMessage = response;

      if (response.startsWith("SUCCESS")) {
        _statusColor = Colors.tealAccent;
      } else if (response.startsWith("BLOCKED")) {
        _statusColor = Colors.redAccent;
      } else {
        _statusColor = Colors.orangeAccent;
      }

      notifyListeners();
    }
  }
}
