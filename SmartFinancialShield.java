import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.web.WebView;
import javafx.scene.web.WebEngine;
import javafx.scene.layout.BorderPane;
import javafx.stage.Stage;

public class SmartFinancialShield extends Application {

    private WebView webView;
    private WebEngine webEngine;

    @Override
    public void start(Stage stage) {
        // Create WebView
        webView = new WebView();
        webEngine = webView.getEngine();

        // Load the app from localhost:3000
        webEngine.load("http://localhost:3000");

        // Create root layout
        BorderPane root = new BorderPane();
        root.setCenter(webView);

        // Create scene
        Scene scene = new Scene(root, 800, 600);

        // Configure stage
        stage.setTitle("SMART FINANCIAL SHIELD");
        stage.setScene(scene);
        stage.setWidth(900);
        stage.setHeight(700);
        stage.show();

        System.out.println("✓ SmartFinancialShield app running at http://localhost:3000");
    }

    public static void main(String[] args) {
        launch(args);
    }
}
