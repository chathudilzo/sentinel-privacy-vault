package com.sentinel.policy.repository;

import com.sentinel.policy.model.PolicyRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PolicyRuleRepository extends JpaRepository<PolicyRule, Long> {
    List<PolicyRule> findByRuleTypeAndIsActiveTrue(String ruleType);
}