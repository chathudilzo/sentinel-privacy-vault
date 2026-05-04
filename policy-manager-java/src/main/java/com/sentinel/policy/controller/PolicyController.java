package com.sentinel.policy.controller;

import com.sentinel.policy.model.AuditLog;
import com.sentinel.policy.model.PolicyRule;
import com.sentinel.policy.repository.AuditLogRepository;
import com.sentinel.policy.repository.PolicyRuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/policy")
public class PolicyController {

    @Autowired
    private PolicyRuleRepository policyRepository;

    @Autowired
    private AuditLogRepository auditLogRepository; 

    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkUploadPolicy(@RequestParam String filename) {
        
        List<PolicyRule> blockedRules = policyRepository.findByRuleTypeAndIsActiveTrue("BLOCKED_KEYWORD");
        AuditLog logEntry = new AuditLog();
        logEntry.setFilename(filename);
        logEntry.setTimestamp(LocalDateTime.now());

        for (PolicyRule rule : blockedRules) {
            if (filename.toLowerCase().contains(rule.getRuleValue().toLowerCase())) {
                
                String reason = "Filename contains blocked word: " + rule.getRuleValue();
                
                logEntry.setStatus("DENIED");
                logEntry.setReason(reason);
                auditLogRepository.save(logEntry);

                return ResponseEntity.status(403).body(Map.of(
                    "status", "DENIED",
                    "message", "Security policy violation: " + reason,
                    "code", 403
                ));
            }
        }

        logEntry.setStatus("APPROVED");
        logEntry.setReason("Passed all security checks");
        auditLogRepository.save(logEntry);

        return ResponseEntity.ok(Map.of(
            "status", "APPROVED",
            "message", "File cleared for vaulting",
            "code", 200
        ));
    }

    @GetMapping("/rules")
public List<PolicyRule> getAllRules() {
    return policyRepository.findAll();
}

@PostMapping("/rules")
public PolicyRule addRule(@RequestBody PolicyRule newRule) {
    newRule.setActive(true); 
    return policyRepository.save(newRule);
}

@DeleteMapping("/rules/{id}")
public ResponseEntity<String> deleteRule(@PathVariable Long id) {
    if (policyRepository.existsById(id)) {
        policyRepository.deleteById(id);
        return ResponseEntity.ok("Rule deleted successfully");
    }
    return ResponseEntity.status(404).body("Rule not found");
}
}