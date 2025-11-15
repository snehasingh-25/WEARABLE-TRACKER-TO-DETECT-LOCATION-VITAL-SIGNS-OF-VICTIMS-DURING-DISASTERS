import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import Card from '../../components/Card';
import Button from '@/components/Button';
import { Ionicons } from '@expo/vector-icons';
import {SafeAreaView} from "react-native-safe-area-context";

export default function ContactsScreen() {
  const [contacts, setContacts] = useState([
    { id: '1', name: 'Mom', phone: '+91 9876543210' },
    { id: '2', name: 'Dad', phone: '+91 9123456780' },
    { id: 'police', name: 'Police', phone: '100', role: 'Emergency' },
    { id: 'ambulance', name: 'Ambulance', phone: '102', role: 'Medical' },
    { id: 'fire', name: 'Fire Brigade', phone: '101', role: 'Fire' },
    { id: 'disaster', name: 'Disaster Management', phone: '108', role: 'Disaster Response' },
    { id: 'hospital', name: 'Nearest Hospital', phone: '+91-11-12345678', role: 'Hospital' }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleAddContact = () => {
    if (!name || !phone) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    const newContact = { id: Date.now().toString(), name, phone };
    setContacts([...contacts, newContact]);
    setName('');
    setPhone('');
    setModalVisible(false);
    Alert.alert('Success', 'Contact added successfully');
  };

  const handleDeleteContact = (id, contactName) => {
    Alert.alert(`Delete Contact`, `Remove ${contactName} from emergency contacts?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setContacts(contacts.filter(c => c.id !== id)) },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 px-5 py-5">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-gray-900 text-2xl font-bold">Emergency Contacts</Text>
          <TouchableOpacity className="p-1" onPress={() => setModalVisible(true)}>
            <Ionicons name="add-circle" size={32} color="#10b981" />
          </TouchableOpacity>
        </View>

        {/* Contacts List */}
        <ScrollView className="flex-1">
          {contacts.map(contact => (
            <Card key={contact.id} className="mb-3">
              <View className="flex-row items-center">
                <View className="mr-4">
                  <Ionicons name="person-circle" size={48} color="#10b981" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 text-lg font-semibold mb-1">{contact.name}</Text>
                  <View className="flex-row items-center space-x-2">
                    <Ionicons name="call" size={16} color="#6b7280" />
                    <Text className="text-gray-500 text-sm">{contact.phone}</Text>
                  </View>
                </View>
                <TouchableOpacity className="p-2" onPress={() => handleDeleteContact(contact.id, contact.name)}>
                  <Ionicons name="trash-outline" size={24} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </ScrollView>

        {/* Add Contact Modal */}
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-3xl p-6 min-h-[300px]">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-gray-900 text-xl font-bold">Add Emergency Contact</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={28} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <View className="space-y-4">
                <View>
                  <Text className="text-gray-700 text-sm font-semibold mb-2">Name</Text>
                  <TextInput
                    className="bg-gray-100 border border-gray-300 rounded-xl py-4 px-4 text-gray-900 text-base"
                    placeholder="Enter contact name"
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                <View>
                  <Text className="text-gray-700 text-sm font-semibold mb-2">Phone</Text>
                  <TextInput
                    className="bg-gray-100 border border-gray-300 rounded-xl py-4 px-4 text-gray-900 text-base"
                    placeholder="Enter phone number"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>

                <Button title="Add Contact" onPress={handleAddContact} />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
