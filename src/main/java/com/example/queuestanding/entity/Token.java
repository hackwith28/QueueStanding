package com.example.queuestanding.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Token {
    @ManyToOne
    @JoinColumn(name = "organization_id")
    private Organization organization;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userName;

    private int tokenNumber;

    private String status; // WAITING, SERVED

    private int position;
}
