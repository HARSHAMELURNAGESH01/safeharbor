package safeharbor;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/patients")
public class PatientController {

    private final PatientRepository repository;
    private final DeidentificationService deidentifier;
    private final AuditService audit;

    public PatientController(PatientRepository repository,
                             DeidentificationService deidentifier,
                             AuditService audit) {
        this.repository = repository;
        this.deidentifier = deidentifier;
        this.audit = audit;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Patient> getAllRaw() {
        audit.record("READ_RAW_PHI", "all patients");
        return repository.findAll();
    }

    @GetMapping("/deidentified")
    public List<DeidentifiedPatient> getDeidentified() {
        audit.record("READ_DEIDENTIFIED", "all patients");
        return repository.findAll().stream()
                .map(deidentifier::deidentify)
                .toList();
    }
}
