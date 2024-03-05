import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

import java.util.Scanner;

public class UserManagement {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Welcome to User Management System");
        System.out.println("Please enter your name:");
        String name = scanner.nextLine();

        System.out.println("Please enter your username:");
        String username = scanner.nextLine();

        System.out.println("Please enter your password:");
        String password = scanner.nextLine();

        // Create a MongoDB client and connect to the database
        try (MongoClient mongoClient = MongoClients.create("mongodb://localhost:27017")) {
            // Access the database
            MongoDatabase database = mongoClient.getDatabase("chat_app_db");

            // Access the collection (table) where users will be stored
            MongoCollection<Document> collection = database.getCollection("users");

            // Create a document (row) to store user information
            Document user = new Document("name", name)
                    .append("username", username)
                    .append("password", password);

            // Insert the document into the collection
            collection.insertOne(user);

            System.out.println("User information stored successfully.");
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
        } finally {
            scanner.close();
        }
    }
}
