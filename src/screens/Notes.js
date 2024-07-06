import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const Notes = ({ route }) => {
  const { userId } = route.params;
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(
        `http://13.202.67.81:33000/api/notess/userId/${userId}`
      );
      console.log("API response:", response.data);
      const validNotes = response.data.filter((note) => note && note.id);
      setNotes(validNotes);
      console.log("Fetched notes:", validNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleNoteSubmission = async () => {
    if (!noteText.trim()) {
      Alert.alert("Error", "Please enter note text.");
      return;
    }

    const noteAction = editingNoteId ? editNote : addNote;
    noteAction();
  };

  const addNote = async () => {
    const newNote = {
      user: userId,
      notes: noteText,
      date: new Date(),
    };
    try {
      const response = await axios.post(
        "http://13.202.67.81:33000/api/notess",
        newNote
      );
      const createdNote =
        typeof response.data === "number"
          ? { ...newNote, id: response.data }
          : response.data;
      setNotes((prevNotes) => [...prevNotes, createdNote]);
      setNoteText("");
      Alert.alert("Success", "Your note has been added successfully.");
    } catch (error) {
      console.error("Error adding note:", error);
      Alert.alert("Error", "Failed to add note. Please try again.");
    }
  };

  const editNote = async () => {
    const updatedNote = {
      id: editingNoteId,
      notes: noteText,
      user: userId,
      date: new Date(),
    };
    try {
      await axios.put(
        `http://13.202.67.81:33000/api/notess/${editingNoteId}`,
        updatedNote
      );
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === editingNoteId ? updatedNote : note
        )
      );
      setNoteText("");
      setEditingNoteId(null);
      Alert.alert("Success", "Your note has been edited successfully.");
    } catch (error) {
      console.error("Error editing note:", error);
      Alert.alert("Error", "Failed to edit note. Please try again.");
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await axios.delete(`http://13.202.67.81:33000/api/notess/${noteId}`);
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      setNotes(updatedNotes);
      Alert.alert("Note Deleted", "Your note has been deleted successfully.");
    } catch (error) {
      console.error("Error deleting note:", error);
      Alert.alert("Error", "Failed to delete note.");
    }
  };

  const renderNoteItem = ({ item }) => (
    <TouchableOpacity
      style={styles.noteItem}
      onPress={() => {
        setNoteText(item.notes);
        setEditingNoteId(item.id);
      }}
    >
      <View style={styles.noteHeader}>
        <View
          style={[
            styles.categoryIndicator,
            { backgroundColor: getCategoryColor(item.category) },
          ]}
        />
        <Text style={styles.noteText} numberOfLines={2}>
          {item.notes}
        </Text>
      </View>
      <Text style={styles.noteDate}>
        Date: {new Date(item.date).toLocaleString()}
      </Text>
      <View style={styles.noteActions}>
        <TouchableOpacity onPress={() => deleteNote(item.id)}>
          <Ionicons name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const getCategoryColor = (category) => {
    const colors = {
      Health: "#FF9800",
      Important: "#F44336",
      Schedule: "#2196F3",
      Default: "#9C27B0",
    };
    return colors[category] || colors.Default;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notes</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={notes}
        renderItem={renderNoteItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.noteList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter note text"
          value={noteText}
          onChangeText={setNoteText}
          multiline
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleNoteSubmission}
        >
          <Ionicons
            name={editingNoteId ? "checkmark" : "add"}
            size={24}
            color="#FFF"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  noteList: {
    padding: 16,
  },
  noteItem: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  noteHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  noteText: {
    fontSize: 16,
    flex: 1,
  },
  noteDate: {
    fontSize: 12,
    color: "#757575",
  },
  noteActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFF",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  addButton: {
    backgroundColor: "#9C27B0",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Notes;
