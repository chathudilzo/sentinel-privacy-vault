import 'package:flutter/material.dart';
import 'package:mobile_app/providers/vault_provider.dart';
import 'package:mobile_app/screens/vault_screen.dart';
import 'package:provider/provider.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: ".env");
  runApp(
    ChangeNotifierProvider(
      create: (context) => VaultProvider(),
      child: const SentinelApp(),
    ),
  );
}

class SentinelApp extends StatelessWidget {
  const SentinelApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sentinel Vault',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark(),
      home: const VaultScreen(),
    );
  }
}
