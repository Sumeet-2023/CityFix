import React, { useState } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Provider as PaperProvider, DefaultTheme, Surface } from 'react-native-paper';
import DropdownComponent from '../../components/dropDown';
import { LinearGradient } from 'expo-linear-gradient';
import CustomKeyBoardView from "../../components/chat/customKeyboardView";
import EventHeader from '../../components/event/eventHeader';
import { useAuthStore } from '../store';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { serverurl } from '../../firebaseConfig';
import { router } from 'expo-router';

const enhancedTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#4F46E5',
        accent: '#818CF8',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        text: '#1E293B',
        placeholder: '#64748B',
    },
    roundness: 16,
};

const InsertTransaction = () => {
    const [amount, setAmount] = useState('');
    const [externalTxId, setExternalTxId] = useState('');
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [errors, setErrors] = useState({});
    const {user} = useAuthStore();
    const {fundId} = useLocalSearchParams();
    const userId = user?.id;

    const paymentMethodOptions = [
        { label: 'Credit Card', value: 'Credit Card' },
        { label: 'Cash', value: 'Cash' },
        { label: 'UPI', value: 'UPI' },
        { label: 'PayPal', value: 'PayPal' },
        { label: 'Bank Transfer', value: 'Bank Transfer' },
    ];

    const validateForm = () => {
        const newErrors = {};

        if (!amount || isNaN(parseInt(amount)) || parseInt(amount) <= 0) {
        newErrors.amount = 'Please enter a valid amount';
        }

        if (!fundId) {
        newErrors.fundId = 'Please select a fund';
        }

        if (!userId) {
        newErrors.userId = 'Please select a user';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        try {
            if (!validateForm()) {
                Alert.alert('Validation Error', 'Please check the form for errors');
                return;
            }
    
            const transactionData = {
                amount: parseInt(amount),
                fundId,
                userId,
                externalTxId,
                paymentMethod,
                date: new Date(),
            };
    
            const res = await axios.post(`${serverurl}/funding/transaction`, transactionData);
            if (res.status === 201) {
                router.push({pathname: '/(modals)/viewFund', params: {fundId: fundId}})
            } else {
                console.log('Error inserting transaction: ', res.error);
            }
    
        } catch (error) {
            alert('Error inserting transaction');
            console.log('Error creating transaction!');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <PaperProvider theme={enhancedTheme}>
                <EventHeader Heading={'Create Transaction Record'}/>
                <CustomKeyBoardView >
                    <ScrollView>
                        <LinearGradient
                            colors={['#4F46E5', '#818CF8']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="px-8 pt-12 pb-16 rounded-b-[40px] shadow-lg"
                        >
                            <View className="items-center">
                            <Text className="text-4xl font-bold text-white text-center mb-3">Insert Transaction</Text>
                            <Text className="text-lg text-indigo-100 text-center opacity-90">
                                Record a new transaction
                            </Text>
                            </View>
                        </LinearGradient>

                        <View className="px-4 -mt-8">
                            <Surface className="rounded-3xl p-6 mb-6 elevation-4 bg-white">
                            <Text className="text-lg font-semibold text-gray-800 mb-2">Amount</Text>
                            <View className="flex flex-row items-center border border-gray-300 rounded-lg bg-white mb-4 shadow-sm">
                                <Text className="px-4 text-xl text-gray-600">$</Text>
                                <TextInput
                                className="flex-1 text-lg"
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                                placeholder="Enter amount"
                                mode="outlined"
                                theme={{ colors: { primary: '#4F46E5', placeholder: '#64748B' }}}
                                />
                            </View>
                            {errors.amount && <Text className="text-sm text-red-500">{errors.amount}</Text>}

                            {/* <Text className="text-lg font-semibold text-gray-800 mb-2">Select Fund</Text>
                            <DropdownComponent
                                data={fundOptions}
                                value={fundId}
                                onChange={setFundId}
                            />
                            {errors.fundId && <Text className="text-sm text-red-500">{errors.fundId}</Text>} */}

                            {/* <Text className="text-lg font-semibold text-gray-800 mb-2">Select User</Text>
                            <DropdownComponent
                                data={userOptions}
                                value={userId}
                                onChange={setUserId}
                            />
                            {errors.userId && <Text className="text-sm text-red-500">{errors.userId}</Text>} */}

                            <Text className="text-lg font-semibold text-gray-800 mb-2">External Transaction ID</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg p-3 text-lg bg-white mb-4 shadow-sm"
                                value={externalTxId}
                                onChangeText={setExternalTxId}
                                placeholder="Optional"
                                mode="outlined"
                                theme={{ colors: { primary: '#4F46E5', placeholder: '#64748B' }}}
                            />

                            <Text className="text-lg font-semibold text-gray-800 mb-2">Payment Method</Text>
                            <DropdownComponent
                                data={paymentMethodOptions}
                                value={paymentMethod}
                                onChange={setPaymentMethod}
                            />
                            </Surface>

                            <View className="mb-12">
                            <Button
                                mode="contained"
                                onPress={handleSubmit}
                                style={{ width: '80%', alignSelf: 'center' }}
                                contentStyle={{ height: 50 }}
                            >
                                Insert Transaction
                            </Button>
                            </View>
                        </View>
                    </ScrollView>
                </CustomKeyBoardView>
            </PaperProvider>
        </SafeAreaView>
    );
};

export default InsertTransaction;