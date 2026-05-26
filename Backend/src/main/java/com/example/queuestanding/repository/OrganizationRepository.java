package com.example.queuestanding.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.queuestanding.entity.Organization;

import java.util.Optional;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {

    Optional<Organization> findByNameIgnoreCase(String name);
}