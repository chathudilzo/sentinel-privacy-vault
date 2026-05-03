package com.sentinel.policy.controller;

import com.sentinel.policy.model.PolicyRule;
import com.sentinel.policy.repository.PolicyRuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/policy")
public class PolicyController {

    @Autowired
    private PolicyRuleRepository repository;

    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkUploadPolicy(@RequestParam String filename) {
        
        List<PolicyRule> blockedRules = repository.findByRuleTypeAndIsActiveTrue("BLOCKED_KEYWORD");

        for (PolicyRule rule : blockedRules) {
            if (filename.toLowerCase().contains(rule.getRuleValue().toLowerCase())) {
                return ResponseEntity.status(403).body(Map.of(
                    "status", "DENIED",
                    "message", "Security policy violation: Filename contains blocked word: " + rule.getRuleValue(),
                    "code", 403
                ));
            }
        }

        return ResponseEntity.ok(Map.of(
            "status", "APPROVED",
            "message", "File cleared for vaulting",
            "code", 200
        ));
    }
}