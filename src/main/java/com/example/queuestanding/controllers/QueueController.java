package com.example.queuestanding.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.queuestanding.entity.Token;
import com.example.queuestanding.services.QueueService;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.List;

@RestController
@RequestMapping("/queue")
@CrossOrigin("*")
public class QueueController {

    @Autowired
    private QueueService queueService;

    @PostMapping("/join")
    public Token join(@RequestParam String name, @RequestParam Long orgId) {
        return queueService.joinQueue(name, orgId);
    }

    @GetMapping("/{orgId}")
    public List<Token> getQueue(@PathVariable Long orgId) {
        return queueService.getQueue(orgId);
    }

    @PostMapping("/serve/{orgId}")
    public Token serveNext(@PathVariable Long orgId) {
        return queueService.serveNext(orgId);
    }
}