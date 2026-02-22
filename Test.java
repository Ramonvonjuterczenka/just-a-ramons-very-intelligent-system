import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class Test {
    public static void main(String[] args) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=invalid_key";
        HttpRequest request = HttpRequest.newBuilder(URI.create(url))
                .POST(HttpRequest.BodyPublishers.ofString("{\"contents\":[{\"parts\":[{\"text\":\"hi\"}]}]}"))
                .header("Content-Type", "application/json")
                .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        System.out.println("Status: " + response.statusCode());
        System.out.println("Body: " + response.body());
    }
}
