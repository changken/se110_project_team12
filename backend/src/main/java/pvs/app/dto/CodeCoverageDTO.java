package pvs.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
public class CodeCoverageDTO {
    Date date;
    Double value;

}
