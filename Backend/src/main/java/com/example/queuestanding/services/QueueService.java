package com.example.queuestanding.services;

import com.example.queuestanding.entity.Organization;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.util.List;
import com.example.queuestanding.entity.Token;
import com.example.queuestanding.repository.TokenRepository;
import com.example.queuestanding.repository.OrganizationRepository;

@Service
public class QueueService {

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // JOIN QUEUE
    public Token joinQueue(String userName, Long orgId) {
        Organization org = organizationRepository.findById(orgId).orElseThrow();

        int nextToken = tokenRepository.countByOrganization(org) + 1;

        Token token = new Token();
        token.setUserName(userName);
        token.setTokenNumber(nextToken);
        token.setStatus("WAITING");
        token.setOrganization(org);

        Token saved = tokenRepository.save(token);

        messagingTemplate.convertAndSend("/topic/queue/" + orgId, getQueue(orgId));

        return saved;
    }

    // GET QUEUE
    public List<Token> getQueue(Long orgId) {
        Organization org = organizationRepository.findById(orgId).orElseThrow();

        return tokenRepository
                .findByOrganizationAndStatusOrderByTokenNumberAsc(org, "WAITING");
    }

    // SERVE NEXT
    public Token serveNext(Long orgId) {
        List<Token> queue = getQueue(orgId);

        if (queue.isEmpty()) return null;

        Token next = queue.get(0);
        next.setStatus("SERVED");

        Token served = tokenRepository.save(next);

        messagingTemplate.convertAndSend("/topic/queue/" + orgId, getQueue(orgId));

        return served;
    }
}

