import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Card from '../../components/Card';
import Button from '@/components/Button';

export default function ContactsScreen() {
  const [contacts, setContacts] = useState([
    { id: '1', name: 'Mom', phone: '+91 8312006022' },
    { id: '2', name: 'Dad', phone: '+91 234567890' },
    { id: 'police', name: 'Police', phone: '100', role: 'Emergency' },
    { id: 'ambulance', name: 'Ambulance', phone: '102', role: 'Medical' },
    { id: 'fire', name: 'Fire Brigade', phone: '101', role: 'Fire' },
    { id: 'disaster', name: 'Disaster Management', phone: '108', role: 'Disaster Response' },
    { id: 'hospital', name: 'Nearest Hospital', phone: '+91-11-12345678', role: 'Hospital' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // ---------------- CALL FUNCTION ----------------
  const makeCall = async (phoneNumber) => {
    const sanitizedNumber = phoneNumber.replace(/\s|-/g, '');
    const url = `tel:${sanitizedNumber}`;

    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert('Error', 'Calling is not supported on this device');
      return;
    }
    await Linking.openURL(url);
  };

  const confirmCall = (contact) => {
    Alert.alert(
      'Confirm Call',
      `Call ${contact.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => makeCall(contact.phone) },
      ],
      { cancelable: true }
    );
  };

  // ---------------- ADD CONTACT ----------------
  const handleAddContact = () => {
    if (!name || !phone) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newContact = {
      id: Date.now().toString(),
      name,
      phone,
    };

    setContacts([...contacts, newContact]);
    setName('');
    setPhone('');
    setModalVisible(false);

    Alert.alert('Success', 'Contact added successfully');
  };

  // ---------------- DELETE CONTACT ----------------
  const handleDeleteContact = (id, contactName) => {
    Alert.alert(
      'Delete Contact',
      `Remove ${contactName} from emergency contacts?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setContacts(contacts.filter(c => c.id !== id)),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 px-5 py-5">

        {/* -------- HEADER -------- */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-gray-900 text-2xl font-bold">
            Emergency Contacts
          </Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons name="add-circle" size={32} color="#10b981" />
          </TouchableOpacity>
        </View>

        {/* -------- CONTACT LIST -------- */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {contacts.map(contact => (
            <TouchableOpacity
              key={contact.id}
              activeOpacity={0.7}
              onPress={() => confirmCall(contact)}
            >
              <Card className="mb-3">
                <View className="flex-row items-center">
                  <Ionicons
                    name="person-circle"
                    size={48}
                    color="#10b981"
                    style={{ marginRight: 12 }}
                  />

                  <View className="flex-1">
                    <Text className="text-gray-900 text-lg font-semibold">
                      {contact.name}
                    </Text>

                    <View className="flex-row items-center mt-1">
                      <Ionicons name="call" size={16} color="#6b7280" />
                      <Text className="text-gray-500 text-sm ml-2">
                        {contact.phone}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleDeleteContact(contact.id, contact.name)}
                  >
                    <Ionicons name="trash-outline" size={24} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* -------- ADD CONTACT MODAL -------- */}
        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-3xl p-6">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl font-bold text-gray-900">
                  Add Emergency Contact
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={28} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <View className="space-y-4">
                <View>
                  <Text className="text-sm font-semibold text-gray-700 mb-2">
                    Name
                  </Text>
                  <TextInput
                    className="bg-gray-100 border border-gray-300 rounded-xl px-4 py-4"
                    placeholder="Enter contact name"
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                <View>
                  <Text className="text-sm font-semibold text-gray-700 mb-2">
                    Phone
                  </Text>
                  <TextInput
                    className="bg-gray-100 border border-gray-300 rounded-xl px-4 py-4"
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
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
