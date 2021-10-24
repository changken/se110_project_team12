package pvs.app.service;

import okhttp3.HttpUrl;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.checkerframework.checker.nullness.qual.AssertNonNullIfNonNull;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.reactive.function.client.WebClient;
import pvs.app.Application;
import pvs.app.dto.BugDTO;
import pvs.app.dto.CodeCoverageDTO;
import pvs.app.dto.CodeSmellDTO;
import pvs.app.dto.DuplicationDTO;

import java.io.IOException;
import java.util.List;


@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
public class SonarApiServiceTest {
    @Autowired
    private SonarApiService sonarApiService;

    private MockWebServer mockWebServer;

    @Before
    public void setup() {
        this.mockWebServer = new MockWebServer();
        this.sonarApiService = new SonarApiService(WebClient.builder(), mockWebServer.url("/").toString());
    }

    @Test
    public void getSonarCodeCoverage() throws IOException {
        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(200)
                .setBody("{\"measures\":[{\"history\":[{\"date\":\"2020-11-20T19:38:25+0800\", \"value\":\"22.5\"}]}]}")
                .addHeader("Content-Type", "application/json")
        );
        List<CodeCoverageDTO> data = sonarApiService.getSonarCodeCoverage("pvs-springboot");
        Assert.assertEquals(Double.valueOf(22.5), data.get(0).getValue());
    }

    @Test
    public void getSonarBug() throws IOException {
        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(200)
                .setBody("{\"measures\":[{\"history\":[{\"date\":\"2020-11-20T19:38:25+0800\", \"value\":\"22\"}]}]}")
                .addHeader("Content-Type", "application/json")
        );
        List<BugDTO> data = sonarApiService.getSonarBug("pvs-springboot");
        Assert.assertEquals(Integer.valueOf(22), data.get(0).getValue());
    }

    @Test
    public void getSonarCodeSmell() throws IOException {
        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(200)
                .setBody("{\"measures\":[{\"history\":[{\"date\":\"2020-11-20T19:38:25+0800\", \"value\":\"22\"}]}]}")
                .addHeader("Content-Type", "application/json")
        );
        List<CodeSmellDTO> data = sonarApiService.getSonarCodeSmell("pvs-springboot");
        Assert.assertEquals(Integer.valueOf(22), data.get(0).getValue());
    }

    @Test
    public void getDuplication() throws IOException {
        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(200)
                .setBody("{\"measures\":[{\"history\":[{\"date\":\"2020-11-20T19:38:25+0800\", \"value\":\"22.5\"}]}]}")
                .addHeader("Content-Type", "application/json")
        );
        List<DuplicationDTO> data = sonarApiService.getDuplication("pvs-springboot");
        Assert.assertEquals(Double.valueOf(22.5), data.get(0).getValue());
    }
}
