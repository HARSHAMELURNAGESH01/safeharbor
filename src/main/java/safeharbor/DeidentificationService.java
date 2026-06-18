package safeharbor;

import org.springframework.stereotype.Service;

@Service
public class DeidentificationService {

    public DeidentifiedPatient deidentify(Patient p) {
        return new DeidentifiedPatient(
                "P-" + p.getId(),                 // a pseudonym, NOT the name or SSN
                birthYearOnly(p.getBirthDate()),  // date reduced to year only
                p.getGender(),                    // gender is not an identifier
                p.getState()                      // state allowed; city/ZIP/street removed
        );
    }

    private String birthYearOnly(String birthDate) {
        if (birthDate == null || birthDate.length() < 4) return null;
        return birthDate.substring(0, 4); // "1985-03-12" -> "1985"
    }
}
