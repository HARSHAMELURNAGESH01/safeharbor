package safeharbor;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "audit_log")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;   // who
    private String action;     // what they did
    private String resource;   // what they accessed
    private Instant timestamp; // when

    public AuditLog() {}

    public AuditLog(String username, String action, String resource) {
        this.username = username;
        this.action = action;
        this.resource = resource;
        this.timestamp = Instant.now();
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getAction() { return action; }
    public String getResource() { return resource; }
    public Instant getTimestamp() { return timestamp; }
}
