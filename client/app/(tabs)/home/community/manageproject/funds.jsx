import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Card, Menu, PaperProvider } from 'react-native-paper';
import * as Localization from 'expo-localization';
import { PieChart, LineChart, BarChart } from 'react-native-gifted-charts';
import FAB from '../../../../../components/FAB';
import { useAuthStore } from '../../../../store';
import { serverurl } from '../../../../../firebaseConfig';
import { router } from 'expo-router';
import DropdownComponent from '../../../../../components/dropDown';

const EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest/USD';

const FundScreen = () => {
    const { user, communityId, projectId, setCurrency, currency } = useAuthStore();
    const screenWidth = Dimensions.get('window').width;
    const [selectedCurrency, setSelectedCurrency] = useState(currency === null ? 'INR' : currency);
    const [exchangeRates, setExchangeRates] = useState({});
    const [userLocale, setUserLocale] = useState(Localization.locale);
    const [loading, setLoading] = useState(true);
    const [funds, setFunds] = useState([]);

    const AVAILABLE_CURRENCIES = [
        { label: 'USD', value: 'USD' },
        { label: 'EUR', value: 'EUR' },
        { label: 'GBP', value: 'GBP' },
        { label: 'JPY', value: 'JPY' },
        { label: 'CNY', value: 'CNY' },
        { label: 'INR', value: 'INR' },
    ];

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
    }, [selectedCurrency]);

    const fetchFundsData = async () => {
        try {
            setLoading(true)
          const response = await fetch(`${serverurl}/funding/project/${projectId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch funds data');
          }
          const data = await response.json();
          setFunds(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
    };

    useEffect(() => {
        fetchFundsData();
    }, [])

    const formatCurrency = (amount, currency = selectedCurrency) => {
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

    // Convert amount between currencies
    const convertAmount = (amount, fromCurrency, toCurrency = selectedCurrency) => {
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

    const statistics = useMemo(() => {
        if (!Array.isArray(funds) || funds.length === 0) {
            return {
                totalRaised: 0,
                totalRequired: 0,
                totalFundings: 0,
                averageCompletion: 0,
                byType: {},
                byPaymentMethod: {},
                transaction: []
            };
        }

        const totalRaised = funds?.reduce((sum, f) => 
            sum + convertAmount(f.amountRaised, f.currency, selectedCurrency), 0);

        const totalRequired = funds?.reduce((sum, f) => 
            sum + convertAmount(f.amountRequired, f.currency, selectedCurrency), 0);

        const totalFundings = funds?.length;
        const averageCompletion = totalRequired > 0 ? (totalRaised / totalRequired) * 100 : 0;

        const byType = funds?.reduce((acc, fund) => {
            if (!acc[fund.type]) acc[fund.type] = { count: 0, amount: 0 };
            acc[fund.type].count++;
            acc[fund.type].amount += convertAmount(fund.amountRaised, fund.currency, selectedCurrency);
            return acc;
        }, {});

        const byPaymentMethod = funds.reduce((acc, fund) => {
            if (Array.isArray(fund.transaction) && fund.transaction.length > 0) {
                fund.transaction.forEach(tx => {
                    if (tx && tx.paymentMethod) {
                        if (!acc[tx.paymentMethod]) acc[tx.paymentMethod] = 0;
                        acc[tx.paymentMethod] += convertAmount(tx.amount, tx.currency, selectedCurrency);
                    }
                });
            }
            return acc;
        }, {});

        return { totalRaised, totalRequired, totalFundings, averageCompletion, byType, byPaymentMethod };
    }, [funds, selectedCurrency, exchangeRates]);

    const pieData = useMemo(() => {
        if (!statistics.byType || Object.keys(statistics.byType).length === 0) return [];
        return Object.entries(statistics.byType).map(([type, data]) => ({
            value: data.amount,
            text: statistics.totalRaised > 0 ? 
                `${((data.amount / statistics.totalRaised) * 100).toFixed(1)}%` : '0%',
            color: type === 'PROJECT' ? '#1E88E5' : '#43A047',
            label: type
        }));
    }, [statistics]);

    const renderLegend = () => {
        return (
            <View style={styles.legendContainer}>
                {pieData && pieData.length > 0 ? (
                    pieData.map((data, index) => (
                        <View key={index} style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: data.color }]} />
                            <Text style={styles.legendText}>{`${data.label}: ${data.text}`}</Text>
                        </View>
                    ))
                ) : (
                    <Text>No data available</Text>
                )}

            </View>
        );
    };

    const barData = useMemo(() => {
        if (!statistics.byPaymentMethod || Object.keys(statistics.byPaymentMethod).length === 0) return [];
        return Object.entries(statistics.byPaymentMethod).map(([method, amount]) => ({
            value: amount,
            label: method,
            frontColor: '#1E88E5',
            sideColor: '#1565C0',
            topColor: '#2196F3'
        }));
    }, [statistics]);

    const timelineData = useMemo(() => {
        if (!funds || funds.length === 0) return [];
        
        const allTransactions = funds.flatMap(fund => 
            fund.transaction?.map(tx => ({
                ...tx,
                date: new Date(tx.date),
                fundType: fund.type
            })) || []
        );

        const grouped = allTransactions.reduce((acc, tx) => {
            const dateKey = tx?.date.toISOString().split('T')[0];
            if (!acc[dateKey]) acc[dateKey] = 0;
            acc[dateKey] += tx?.amount;
            return acc;
        }, {});

        if (Object.keys(grouped).length === 0) return [];

        return Object.entries(grouped)
            .map(([date, value]) => ({
                date: new Date(date),
                value,
                dataPointText: `$${(value / 1000).toFixed(1)}k`,
                label: new Date(date).toLocaleDateString('default', { month: 'short', day: 'numeric' })
            }))
            .sort((a, b) => a.date - b.date);
    }, [funds]);

    const handleCreateFund = () => {
        router.push('/(modals)/createFund');
    }

    const handleFundPress = (fundId) => {
        setCurrency(selectedCurrency);
        router.push({pathname: '/(modals)/viewFund', params: {fundId}});
    }

    return (
        <PaperProvider >
            <View>
                {loading ? (
                    <View className='h-full w-fit p-6 items-center justify-center align-middle'>
                        <Text className='text-lg'>Loading...</Text>
                    </View>
                ) : funds?.length === 0 ? (
                    <View className='h-full w-fit p-6 items-center justify-center align-middle'>
                        <Text className='text-lg'>No Funds Created Yet</Text>
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={styles.container}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.title}>Funding Dashboard</Text>
                            <DropdownComponent data={AVAILABLE_CURRENCIES} value={selectedCurrency} onChange={(value) => setSelectedCurrency(value)}/>
                        </View>

                        {/* Summary Cards */}
                        <View style={styles.summaryGrid}>
                            <Card style={styles.summaryCard}>
                                    <Card.Content>
                                        <Text style={styles.cardLabel}>Total Raised</Text>
                                        <Text style={styles.cardValue}>
                                            {formatCurrency(statistics.totalRaised)}
                                        </Text>
                                    </Card.Content>
                            </Card>
                            <Card style={styles.summaryCard}>
                                <Card.Content>
                                    <Text style={styles.cardLabel}>Active Fundings</Text>
                                    <Text style={styles.cardValue}>{statistics.totalFundings}</Text>
                                </Card.Content>
                            </Card>
                            <Card style={styles.summaryCard}>
                                <Card.Content>
                                    <Text style={styles.cardLabel}>Completion</Text>
                                    <Text style={styles.cardValue}>{statistics.averageCompletion.toFixed(1)}%</Text>
                                </Card.Content>
                            </Card>
                        </View>

                        {/* Funding Distribution */}
                        <Card style={styles.chartCard}>
                                {statistics.totalRaised === 0 ? (
                                    <Card.Content>
                                        <Text style={styles.chartTitle}>No Transaction Records</Text>
                                    </Card.Content>
                                ) : (
                                    <Card.Content>
                                        <Text style={styles.chartTitle}>Funding Distribution by Type</Text>
                                        <View style={styles.chartContainer}>
                                            <PieChart
                                                data={pieData}
                                                donut
                                                radius={80}
                                                innerRadius={60}
                                                centerLabelComponent={() => (
                                                    <View style={styles.centerLabel}>
                                                        <Text style={styles.centerLabelText}>
                                                            {formatCurrency(statistics.totalRaised / 1000)}k
                                                        </Text>
                                                        <Text style={styles.centerLabelSubtext}>Total</Text>
                                                    </View>
                                                )}
                                            />
                                        </View>
                                        {renderLegend()}
                                    </Card.Content>
                                )}
                        </Card>

                        {/* Payment Methods */}
                        <Card style={styles.chartCard}>
                            {statistics.totalRaised === 0 ? (
                                <Card.Content>
                                    <Text style={styles.chartTitle}>No Transaction Records</Text>
                                </Card.Content>
                            ) : (
                                <Card.Content>
                                    <Text style={styles.chartTitle}>Payment Methods</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <BarChart
                                            data={barData}
                                            width={screenWidth - 80}
                                            height={200}
                                            barWidth={40}
                                            spacing={40}
                                            xAxisThickness={1}
                                            yAxisThickness={1}
                                            yAxisTextStyle={styles.chartAxisText}
                                            xAxisLabelTextStyle={styles.chartAxisText}
                                            noOfSections={4}
                                            maxValue={Math.ceil(Math.max(...barData?.map(d => d.value)) * 1.2)}
                                        />
                                    </ScrollView>
                                </Card.Content>
                            )}
                        </Card>

                        {/* Timeline */}
                        <Card style={styles.chartCard}>
                            {statistics.totalRaised === 0 ? (                                
                                <Card.Content>
                                    <Text style={styles.chartTitle}>No Transaction Records</Text>
                                </Card.Content>
                            ) : (
                                <Card.Content>
                                    <Text style={styles.chartTitle}>Funding Timeline</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        <LineChart
                                            data={timelineData}
                                            width={Math.max(screenWidth - 80, timelineData?.length * 80)}
                                            height={200}
                                            spacing={60}
                                            initialSpacing={20}
                                            color="#1E88E5"
                                            thickness={2}
                                            startFillColor="#1E88E5"
                                            endFillColor="#1E88E530"
                                            curved
                                            hideDataPoints={false}
                                            rulesType="solid"
                                            rulesColor="#E0E0E0"
                                            yAxisTextStyle={styles.chartAxisText}
                                            xAxisTextStyle={styles.chartAxisText}
                                        />
                                    </ScrollView>
                                </Card.Content>
                            )}
                        </Card>

                        {/* Active Fundings List */}
                        <Text style={styles.sectionTitle}>Active Fundings</Text>
                        {funds?.map((funding) => (
                            <Card key={funding.id} style={styles.fundingCard} onPress={() => handleFundPress(funding.id)}>
                                <Card.Content>
                                    <View style={styles.fundingHeader}>
                                        <Text style={styles.fundingTitle}>{funding.goalDescription}</Text>
                                        {/* <Text style={styles.fundingType}>{funding.type}</Text> */}
                                    </View>
                                    <View style={styles.progressBar}>
                                        <View 
                                            style={[
                                                styles.progressFill, 
                                                { width: `${(funding.amountRaised / funding.amountRequired) * 100}%` }
                                            ]} 
                                        />
                                    </View>
                                    <View style={styles.fundingDetails}>
                                        <Text style={styles.fundingAmount}>
                                            {formatCurrency(convertAmount(funding.amountRaised, funding.currency, selectedCurrency))} of {formatCurrency(convertAmount(funding.amountRequired, funding.currency, selectedCurrency))}
                                        </Text>
                                        <Text style={styles.fundingPercentage}>
                                            {((funding.amountRaised / funding.amountRequired) * 100).toFixed(1)}%
                                        </Text>
                                    </View>
                                </Card.Content>
                            </Card>
                        ))}
                    </ScrollView>
                )}
            <FAB handlePress={handleCreateFund}/>
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1E88E5',
        marginBottom: 20,
        textAlign: 'center',
    },
    summaryGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    summaryCard: {
        width: '31%',
        elevation: 2,
        backgroundColor: '#FFF'
    },
    headerContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        // alignItems: 'center',
        marginBottom: 20,
    },
    currencySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E3F2FD',
        padding: 8,
        borderRadius: 8,
    },
    currencyText: {
        color: '#1E88E5',
        fontWeight: 'bold',
        marginRight: 4,
    },
    menuContent: {
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 3,
    },
    menuItemText: {
        fontSize: 16,
        color: '#424242',
    },
    menuItemSelected: {
        color: '#1E88E5',
        fontWeight: 'bold',
    },
    cardLabel: {
        fontSize: 12,
        color: '#757575',
        marginBottom: 5,
    },
    cardValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E88E5',
    },
    chartCard: {
        marginBottom: 20,
        elevation: 2,
        backgroundColor: 'white'
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#424242',
        marginBottom: 15,
    },
    chartContainer: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    chartAxisText: {
        fontSize: 10,
        color: '#757575',
    },
    centerLabel: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerLabelText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E88E5',
    },
    centerLabelSubtext: {
        fontSize: 12,
        color: '#757575',
    },
    legendContainer: {
        marginTop: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
        marginBottom: 10,
    },
    legendDot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    legendText: {
        color: '#333',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#424242',
        marginVertical: 15,
    },
    fundingCard: {
        marginBottom: 15,
        elevation: 2,
        backgroundColor: 'white'
    },
    fundingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    fundingTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#424242',
        flex: 1,
    },
    fundingType: {
        fontSize: 12,
        color: '#1E88E5',
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#1E88E5',
        borderRadius: 4,
    },
    fundingDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    fundingAmount: {
        fontSize: 14,
        color: '#757575',
    },
    fundingPercentage: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1E88E5',
    },
    addButton: {
        backgroundColor: '#1E88E5',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 20,
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

});

export default FundScreen;