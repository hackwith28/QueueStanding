package com.example.queuestanding.controllers;

import com.example.queuestanding.entity.Organization;
import com.example.queuestanding.repository.OrganizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/org")
@CrossOrigin("*")
public class OrganizationController {

    @Autowired
    private OrganizationRepository repo;

    @PostMapping("/add")
    public Organization add(@RequestBody Organization org) {
        return repo.save(org);
    }
    @PostMapping("/login")
    public Organization login(@RequestParam String name, @RequestParam String password) {
        Organization org = repo.findByNameIgnoreCase(name)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        if (!org.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        return org;
    }

    @GetMapping
    public List<Organization> getAll() {
        return repo.findAll();
    }
}
