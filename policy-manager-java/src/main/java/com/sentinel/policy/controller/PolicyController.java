package com.sentinel.policy.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/policy")
public class PolicyController {

    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkUploadPolicy(@RequestParam String filename) {
        
        boolean isAllowed = !filename.toLowerCase().contains("secret");

        if (isAllowed) {
            return ResponseEntity.ok(Map.of(
                    "status", "APPROVED",
                    "message", "File cleared for vaulting",
                    "code", 200
            ));
        } else {
            return ResponseEntity.status(403).body(Map.of(
                    "status", "DENIED",
                    "message", "Security policy violation: Sensitive filename detected",
                    "code", 403
            ));
        }
    }
}