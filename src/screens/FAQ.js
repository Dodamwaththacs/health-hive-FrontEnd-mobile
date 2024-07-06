import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const FAQItem = ({ question, answer }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.faqItem}>
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        style={styles.questionContainer}
      >
        <Text style={styles.question}>{question}</Text>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={24}
          color="#0056B3"
        />
      </TouchableOpacity>
      {isExpanded && <Text style={styles.answer}>{answer}</Text>}
    </View>
  );
};

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://192.168.178.140:33000/api/faqs"
        );
        console.log("Response data:", response.data);
        setFaqs(response.data);
      } catch (error) {
        console.error("Error fetching faqs:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error loading FAQs. Please try again later.
        </Text>
      </View>
    );
  }

  if (faqs.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No FAQs available at the moment.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {faqs.map((faq) => (
        <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
  faqItem: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    marginBottom: 40,
    marginTop: -10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0056B3",
    flex: 1,
  },
  answer: {
    fontSize: 16,
    color: "gray",
    marginTop: 8,
    lineHeight: 24,
  },
});

export default FAQ;
