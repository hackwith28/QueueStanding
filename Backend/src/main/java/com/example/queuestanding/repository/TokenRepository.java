package com.example.queuestanding.repository;

import com.example.queuestanding.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.example.queuestanding.entity.Token;

public interface TokenRepository extends JpaRepository<Token, Long> {

    List<Token> findByStatusOrderByTokenNumberAsc(String status);
    List<Token> findByOrganizationAndStatusOrderByTokenNumberAsc(Organization org, String status);

    int countByOrganization(Organization org);

}
