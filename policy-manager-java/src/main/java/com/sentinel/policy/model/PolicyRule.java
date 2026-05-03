package com.sentinel.policy.model;

import jakarta.persistence.*;

@Entity
@Table(name = "policy_rules") 
public class PolicyRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ruleType;  
    private String ruleValue; 
    private boolean isActive;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRuleType() { return ruleType; }
    public void setRuleType(String ruleType) { this.ruleType = ruleType; }
    public String getRuleValue() { return ruleValue; }
    public void setRuleValue(String ruleValue) { this.ruleValue = ruleValue; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
}