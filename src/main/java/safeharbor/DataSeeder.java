package safeharbor;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final DatasetRepository datasets;
    private final UserRepository users;
    private final PasswordEncoder encoder;

    public DataSeeder(DatasetRepository datasets, UserRepository users, PasswordEncoder encoder) {
        this.datasets = datasets;
        this.users = users;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        if (datasets.count() == 0) {
            Dataset d1 = new Dataset();
            d1.setName("Alzheimer's cohort 2024");
            d1.setDescription("Synthetic patient records for AD research");
            d1.setSensitivity("CONTROLLED");
            datasets.save(d1);

            Dataset d2 = new Dataset();
            d2.setName("Public cardiology summary");
            d2.setDescription("De-identified aggregate statistics");
            d2.setSensitivity("PUBLIC");
            datasets.save(d2);
        }

        if (users.count() == 0) {
            User researcher = new User();
            researcher.setUsername("researcher");
            researcher.setPassword(encoder.encode("password123")); // stored hashed
            researcher.setRole("RESEARCHER");
            users.save(researcher);

            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(encoder.encode("admin123")); // stored hashed
            admin.setRole("ADMIN");
            users.save(admin);
        }
    }
}