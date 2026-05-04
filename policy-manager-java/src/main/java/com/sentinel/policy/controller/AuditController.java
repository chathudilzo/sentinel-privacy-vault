package com.sentinel.policy.controller;

    import com.sentinel.policy.model.AuditLog;
    import com.sentinel.policy.repository.AuditLogRepository;
    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RestController;

    import java.util.List;

    @RestController
    @RequestMapping("/api/v1/audit")
    public class AuditController {

        private final AuditLogRepository auditLogRepository;

        public AuditController(AuditLogRepository auditLogRepository) {
            this.auditLogRepository = auditLogRepository;
        }

        @GetMapping("/logs")
        public List<AuditLog> getSecurityFeed() {
            return auditLogRepository.findAllByOrderByIdDesc();
        }
    }