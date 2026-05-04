package com.sentinel.policy.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class ApiKeyFilter implements Filter {

    @Value("${sentinel.api.key}")
    private String expectedApiKey;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        if (req.getRequestURI().startsWith("/api/")) {
            String providedKey = req.getHeader("X-API-KEY");
            
            if (providedKey == null || !providedKey.equals(expectedApiKey)) {
                res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                res.getWriter().write("Unauthorized: Invalid or missing API Key");
                return; 
            }
        }
        
        chain.doFilter(request, response);
    }
}