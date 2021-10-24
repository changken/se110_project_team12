package pvs.app.dto;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.joda.time.format.ISODateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import java.util.Date;

@Data
public class GithubIssueDTO {
    private String repoOwner;
    private String repoName;
    private Date createdAt;
    private Date closedAt;


    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public void setCreatedAt(JsonNode createdAt) {
        DateTimeFormatter isoParser = ISODateTimeFormat.dateTimeNoMillis();
        this.createdAt = isoParser.parseDateTime(createdAt.toString().replace("\"", "")).toDate();
    }

    public Date getClosedAt() {
        return closedAt;
    }

    public void setClosedAt(Date closedAt) {
        this.closedAt = closedAt;
    }

    public void setClosedAt(JsonNode closedAt) {
        if(closedAt != null && closedAt.textValue() != null) {
            DateTimeFormatter isoParser = ISODateTimeFormat.dateTimeNoMillis();
            this.closedAt = isoParser.parseDateTime(closedAt.toString().replace("\"", "")).toDate();
        }
    }
}
