import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:mobile_app/providers/vault_provider.dart';

class VaultScreen extends StatelessWidget {
  const VaultScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final vaultState = context.watch<VaultProvider>();

    return Scaffold(
      backgroundColor: const Color(0xFF01000A),
      body: Stack(
        children: [
          Positioned(
            top: -100,
            left: -100,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.purpleAccent.withOpacity(0.15),
              ),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 100, sigmaY: 100),
                child: Container(color: Colors.transparent),
              ),
            ),
          ),
          Positioned(
            bottom: -50,
            right: -50,
            child: Container(
              width: 250,
              height: 250,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.cyanAccent.withOpacity(0.1),
              ),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 80, sigmaY: 80),
                child: Container(color: Colors.transparent),
              ),
            ),
          ),
          SafeArea(
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 24.0, vertical: 20.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'SENTINEL',
                            style: TextStyle(
                              color: Colors.white.withOpacity(0.9),
                              fontSize: 22,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 4.0,
                            ),
                          ),
                          Text(
                            'SECURE UPLOAD LINK',
                            style: TextStyle(
                              color: Colors.purpleAccent.withOpacity(0.7),
                              fontSize: 10,
                              fontFamily: 'monospace',
                              letterSpacing: 2.0,
                            ),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.05),
                          borderRadius: BorderRadius.circular(12),
                          border:
                              Border.all(color: Colors.white.withOpacity(0.1)),
                        ),
                        child: const Icon(Icons.wifi_tethering,
                            color: Colors.cyanAccent, size: 20),
                      )
                    ],
                  ),
                ),
                Expanded(
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        GestureDetector(
                          onTap: vaultState.isUploading
                              ? null
                              : () => context
                                  .read<VaultProvider>()
                                  .pickAndUploadFile(),
                          child: TweenAnimationBuilder<double>(
                            tween: Tween(begin: 0.95, end: 1.05),
                            duration: const Duration(seconds: 2),
                            curve: Curves.easeInOutSine,
                            builder: (context, scale, child) {
                              return Transform.scale(
                                scale: vaultState.isUploading ? 1.0 : scale,
                                child: AnimatedContainer(
                                  duration: const Duration(milliseconds: 500),
                                  height: 220,
                                  width: 220,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    gradient: RadialGradient(
                                      colors: [
                                        vaultState.isUploading
                                            ? Colors.purple.withOpacity(0.2)
                                            : Colors.black,
                                        const Color(0xFF05001A),
                                      ],
                                    ),
                                    boxShadow: [
                                      BoxShadow(
                                        color: vaultState.isUploading
                                            ? Colors.purpleAccent
                                                .withOpacity(0.4)
                                            : Colors.cyanAccent
                                                .withOpacity(0.15),
                                        blurRadius: 50,
                                        spreadRadius:
                                            vaultState.isUploading ? 20 : 5,
                                      ),
                                      BoxShadow(
                                        color: vaultState.isUploading
                                            ? Colors.purple.withOpacity(0.2)
                                            : Colors.cyan.withOpacity(0.05),
                                        blurRadius: 100,
                                        spreadRadius: 30,
                                      ),
                                    ],
                                    border: Border.all(
                                      color: vaultState.isUploading
                                          ? Colors.purpleAccent.withOpacity(0.8)
                                          : Colors.white.withOpacity(0.1),
                                      width: vaultState.isUploading ? 2 : 1,
                                    ),
                                  ),
                                  child: Stack(
                                    alignment: Alignment.center,
                                    children: [
                                      Icon(
                                        Icons.radar,
                                        size: 180,
                                        color: Colors.white.withOpacity(0.02),
                                      ),
                                      vaultState.isUploading
                                          ? const SizedBox(
                                              height: 60,
                                              width: 60,
                                              child: CircularProgressIndicator(
                                                color: Colors.purpleAccent,
                                                strokeWidth: 2,
                                              ),
                                            )
                                          : Icon(
                                              Icons.fingerprint,
                                              size: 70,
                                              color: Colors.cyanAccent
                                                  .withOpacity(0.8),
                                            ),
                                    ],
                                  ),
                                ),
                              );
                            },
                            onEnd: () {},
                          ),
                        ),
                        const SizedBox(height: 60),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(16),
                          child: BackdropFilter(
                            filter: ImageFilter.blur(sigmaX: 15, sigmaY: 15),
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 300),
                              width: MediaQuery.of(context).size.width * 0.85,
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 24, vertical: 20),
                              decoration: BoxDecoration(
                                color: vaultState.statusColor.withOpacity(0.05),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color:
                                      vaultState.statusColor.withOpacity(0.2),
                                  width: 1,
                                ),
                              ),
                              child: Row(
                                children: [
                                  // Status Dot
                                  Container(
                                    width: 8,
                                    height: 8,
                                    decoration: BoxDecoration(
                                      color: vaultState.statusColor,
                                      shape: BoxShape.circle,
                                      boxShadow: [
                                        BoxShadow(
                                          color: vaultState.statusColor,
                                          blurRadius: 10,
                                          spreadRadius: 2,
                                        )
                                      ],
                                    ),
                                  ),
                                  const SizedBox(width: 16),
                                  Expanded(
                                    child: Text(
                                      vaultState.statusMessage.toUpperCase(),
                                      style: TextStyle(
                                        color: vaultState.statusColor,
                                        fontFamily: 'monospace',
                                        fontWeight: FontWeight.w600,
                                        fontSize: 13,
                                        letterSpacing: 1.2,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
