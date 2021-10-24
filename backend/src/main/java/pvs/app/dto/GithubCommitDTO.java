package pvs.app.dto;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Optional;
import java.util.TimeZone;

@Data
public class GithubCommitDTO {

    static final Logger logger = LogManager.getLogger(GithubCommitDTO.class.getName());

    private String repoOwner;
    private String repoName;
    private Date committedDate;
    private int additions;
    private int deletions;
    private int changeFiles;
    private String authorName;
    private String authorEmail;


    public void setCommittedDate(Date committedDate) {
        this.committedDate = committedDate;
    }


    public void setAuthor(Optional<JsonNode> authorJson) {
        authorJson.map(s -> s.get("name")).ifPresent(s -> this.authorName = s.toString());
        authorJson.map(s -> s.get("email")).ifPresent(s -> this.authorEmail = s.toString());
    }

    public void setCommittedDate(JsonNode committedDate) {

        DateTimeFormatter isoParser = ISODateTimeFormat.dateTimeNoMillis();
        this.committedDate =
                isoParser.parseDateTime(committedDate.toString().replace("\"", "")).toDate();
    }

    public String getAddSecondsToCommittedDateISOString(int seconds) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(this.committedDate);
        calendar.add(Calendar.SECOND, seconds);
        TimeZone tz = TimeZone.getDefault();
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm'Z'");
        df.setTimeZone(tz);
        return df.format(calendar.getTime());
    }
}
