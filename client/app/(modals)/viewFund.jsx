import React, { useEffect, useState } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { Text, Card, Button, List, Divider } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import EventHeader from '../../components/event/eventHeader';
import { serverurl } from '../../firebaseConfig';
import { useAuthStore } from '../store';
import * as Localization from 'expo-localization';
import FAB from '../../components/FAB';

const FundDetailScreen = () => {
    const { fundId } = useLocalSearchParams();
    const {currency: currentCurrency} = useAuthStore();
    const [fund, setFund] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [exchangeRates, setExchangeRates] = useState({});
    const [userLocale, setUserLocale] = useState(Localization.locale);

    const EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest/USD';

    useEffect(() => {
        const fetchExchangeRates = async () => {
            try {
                const response = await fetch(EXCHANGE_RATE_API);
                const data = await response.json();
                setExchangeRates(data.rates);
            } catch (error) {
                console.error('Failed to fetch exchange rates:', error);
            }
        };

        fetchExchangeRates();
        // Refresh rates every hour
        const interval = setInterval(fetchExchangeRates, 3600000);
        return () => clearInterval(interval);
    }, []);

    const formatCurrency = (amount, currency = currentCurrency) => {
        try {
            return new Intl.NumberFormat(userLocale, {
                style: 'currency',
                currency: currency, 
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(amount);
        } catch (error) {
            console.error('Currency formatting error:', error);
            return `${currency} ${amount.toFixed(2)}`;
        }
    };

    const convertAmount = (amount, fromCurrency, toCurrency = currentCurrency) => {
        if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
            return amount;
        }
        
        // Convert to USD first (base currency), then to target currency
        const amountInUSD = fromCurrency === 'USD' ? 
            amount : 
            amount / exchangeRates[fromCurrency];
        
        return toCurrency === 'USD' ? 
            amountInUSD : 
            amountInUSD * exchangeRates[toCurrency];
    };


    useEffect(() => {
        const fetchFundDetails = async () => {
        try {
            const fundResponse = await fetch(`${serverurl}/funding/${fundId}`);
            const fundData = await fundResponse.json();
            const transactionResponse = await fetch(`${serverurl}/funding/transactions/fund/${fundId}`);
            const transactionData = await transactionResponse.json();
            setFund(fundData);
            setTransactions(transactionData);
        } catch (error) {
            console.error(error);
        }
        };

        fetchFundDetails();
    }, [fundId]);

    if (!fund) {
        return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Loading Fund Details...</Text>
        </View>
        );
    }

    const handlePressFAB = (fundId) => {
        router.push({pathname: '/(modals)/createTransaction', params: {fundId}})
    }

    return (
        <SafeAreaView className='pt-8'>
            <View>
                <ScrollView>
                    <EventHeader Heading={'Fund Details'}/>
                    <View style={{padding: 16}}>
                        {/* Fund Info Card */}
                        <Card style={{ marginBottom: 16, backgroundColor: "#FFF" }}>
                            <Card.Title title="Fund Details" titleStyle={{color: 'black'}}/>
                            <Card.Content>
                            <Text variant="displaySmall" className='text-black'>Goal Description:</Text>
                            <Text className='text-black'>{fund.goalDescription || 'No description available'}</Text>

                            <Divider style={{ marginVertical: 8 }} />

                            <Text variant="displaySmall" className='text-black'>Fund Info</Text>
                            <List.Item
                                title="Amount Raised"
                                description={`${formatCurrency(convertAmount(fund.amountRaised, fund.currency, currentCurrency))}`}
                                titleStyle={{color: 'black'}}
                                descriptionStyle={{color: 'black'}}
                                left={() => <List.Icon icon="currency-usd" color='black'/>}
                            />
                            <List.Item
                                title="Amount Required"
                                description={`${formatCurrency(convertAmount(fund.amountRequired, fund.currency, currentCurrency))}`}
                                titleStyle={{color: 'black'}}
                                descriptionStyle={{color: 'black'}}

                                left={() => <List.Icon icon="currency-usd" color='black'/>}
                            />
                            <List.Item
                                title="Date Created"
                                description={new Date(fund.dateCreated).toLocaleDateString()}
                                titleStyle={{color: 'black'}}
                                descriptionStyle={{color: 'black'}}
                                left={() => <List.Icon icon="calendar" color='black'/>}
                            />
                            <List.Item
                                title="Last Updated"
                                description={new Date(fund.lastUpdated).toLocaleDateString()}
                                titleStyle={{color: 'black'}}
                                descriptionStyle={{color: 'black'}}
                                left={() => <List.Icon icon="calendar-refresh" color='black'/>}
                            />
                            </Card.Content>
                        </Card>

                        {/* Transaction List */}
                        <Card style={{backgroundColor: 'white'}}>
                            <Card.Title title="Transactions" titleStyle={{color: 'black'}} />
                            <Card.Content>
                            {transactions.length === 0 ? (
                                <Text style={{color: 'black'}}>No transactions available.</Text>
                            ) : (
                                transactions.map((transaction) => (
                                <Card key={transaction.id} style={{ marginBottom: 8, backgroundColor: 'white' }}>
                                    <Card.Content>
                                    <List.Item
                                        title={`Transaction ID: ${transaction.id}`}
                                        description={`Amount: $${transaction.amount}`}
                                        titleStyle={{color: 'black'}}
                                        descriptionStyle={{color: 'black'}}
                                        left={() => <List.Icon icon="credit-card" color='black' />}
                                    />
                                    <List.Item
                                        title={`Payment Method`}
                                        description={transaction.paymentMethod || 'Not available'}
                                        titleStyle={{color: 'black'}}
                                        descriptionStyle={{color: 'black'}}
                                        left={() => <List.Icon icon="credit-card-outline" color='black' />}
                                    />
                                    <List.Item
                                        title={`User`}
                                        description={`${transaction.user.username} (${transaction.user.email})`}
                                        titleStyle={{color: 'black'}}
                                        descriptionStyle={{color: 'black'}}
                                        left={() => <List.Icon icon="account" color='black'/>}
                                    />
                                    <Text variant="bodyMedium" style={{ color: 'gray' }}>
                                        Date: {new Date(transaction.date).toLocaleDateString()}
                                    </Text>
                                    </Card.Content>
                                </Card>
                                ))
                            )}
                            </Card.Content>
                        </Card>

                        {/* Button to go back to the previous screen */}
                        <Button
                            mode="contained"
                            onPress={() => router.back()}
                            style={{ marginTop: 16 }}
                        >
                            Go Back
                        </Button>
                    </View>
                </ScrollView>
                <FAB handlePress={() => handlePressFAB(fundId)}/>
            </View>
        </SafeAreaView>
    );
};

export default FundDetailScreen;