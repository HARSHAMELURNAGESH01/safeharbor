package safeharbor;

import com.opencsv.CSVReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Component
public class PatientLoader implements CommandLineRunner {

    private final PatientRepository patients;

    public PatientLoader(PatientRepository patients) {
        this.patients = patients;
    }

    @Override
    public void run(String... args) throws Exception {
        if (patients.count() > 0) return; // already loaded

        ClassPathResource resource = new ClassPathResource("data/patients.csv");
        if (!resource.exists()) {
            System.out.println("No patients.csv found — skipping patient load.");
            return;
        }

        try (CSVReader reader = new CSVReader(
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {

            List<String[]> rows = reader.readAll();
            if (rows.isEmpty()) return;

            String[] header = rows.get(0);
            Map<String, Integer> col = new HashMap<>();
            for (int i = 0; i < header.length; i++) col.put(header[i].trim(), i);

            for (int r = 1; r < rows.size(); r++) {
                String[] row = rows.get(r);
                Patient p = new Patient();
                p.setSyntheaId(get(row, col, "Id"));
                p.setFirstName(get(row, col, "FIRST"));
                p.setLastName(get(row, col, "LAST"));
                p.setBirthDate(get(row, col, "BIRTHDATE"));
                p.setGender(get(row, col, "GENDER"));
                p.setSsn(get(row, col, "SSN"));
                p.setAddress(get(row, col, "ADDRESS"));
                p.setCity(get(row, col, "CITY"));
                p.setState(get(row, col, "STATE"));
                p.setZip(get(row, col, "ZIP"));
                patients.save(p);
            }
            System.out.println("Loaded " + (rows.size() - 1) + " synthetic patients.");
        }
    }

    private String get(String[] row, Map<String, Integer> col, String name) {
        Integer i = col.get(name);
        if (i == null || i >= row.length) return null;
        return row[i];
    }
}
