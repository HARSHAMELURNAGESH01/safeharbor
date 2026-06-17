package safeharbor;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    // In production this secret comes from a secure store (e.g. AWS Secrets Manager), never hard-coded.
    private final SecretKey key =
        Keys.hmacShaKeyFor("dev-only-secret-change-me-to-a-long-random-32byte-key!!".getBytes());

    private final long EXPIRATION_MS = 1000 * 60 * 60; // token valid for 1 hour

    public String generateToken(String username, String role) {
        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(key)
                .compact();
    }

    public String getUsername(String token) { return parse(token).getSubject(); }
    public String getRole(String token) { return parse(token).get("role", String.class); }

    private Claims parse(String token) {
        return Jwts.parser().verifyWith(key).build()
                .parseSignedClaims(token).getPayload();
    }
}