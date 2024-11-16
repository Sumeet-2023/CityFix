import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Modal, Portal, Text, Button, Avatar, Card, Title, Paragraph, Divider, Badge } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

const EventDetailsModal = ({ visible, onDismiss, event }) => {
    if (!event) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ONGOING':
                return '#22C55E';
            case 'SCHEDULED':
                return '#3B82F6';
            case 'COMPLETED':
                return '#6B7280';
            default:
                return '#6B7280';
        }
    };

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                contentContainerStyle={styles.modalContainer}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Header Section */}
                    <View style={styles.header}>
                        <Title style={styles.title}>{event.eventName}</Title>
                        <Badge
                            style={[
                                styles.statusBadge,
                                { backgroundColor: getStatusColor(event.status) }
                            ]}
                        >
                            {event.status}
                        </Badge>
                    </View>

                    {/* Description Section */}
                    <Card style={styles.section}>
                        <Card.Content>
                            <Title style={styles.sectionTitle}>Description</Title>
                            <Paragraph style={styles.description}>
                                {event.description}
                            </Paragraph>
                        </Card.Content>
                    </Card>

                    {/* Date & Time Section */}
                    <Card style={styles.section}>
                        <Card.Content>
                            <Title style={styles.sectionTitle}>Date & Time</Title>
                            <View style={styles.timeContainer}>
                                <View style={styles.timeItem}>
                                    <MaterialIcons name="event" size={24} color="#4F46E5" />
                                    <View style={styles.timeTextContainer}>
                                        <Text style={styles.timeLabel}>Starts</Text>
                                        <Text style={styles.timeValue}>
                                            {formatDate(event.startDateTime)}
                                        </Text>
                                    </View>
                                </View>
                                <Divider style={styles.divider} />
                                <View style={styles.timeItem}>
                                    <MaterialIcons name="event" size={24} color="#4F46E5" />
                                    <View style={styles.timeTextContainer}>
                                        <Text style={styles.timeLabel}>Ends</Text>
                                        <Text style={styles.timeValue}>
                                            {formatDate(event.endDateTime)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>

                    {/* Location Section */}
                    {event.location && (
                        <Card style={styles.section}>
                            <Card.Content>
                                <Title style={styles.sectionTitle}>Location</Title>
                                <View style={styles.locationContainer}>
                                    <MaterialIcons name="place" size={24} color="#4F46E5" />
                                    <Text style={styles.locationText}>
                                        {`${event.location.city}, ${event.location.state}, ${event.location.country}`}
                                    </Text>
                                </View>
                            </Card.Content>
                        </Card>
                    )}

                    {/* Creator Section */}
                    {event.creator && (
                        <Card style={styles.section}>
                            <Card.Content>
                                <Title style={styles.sectionTitle}>Created By</Title>
                                <View style={styles.creatorContainer}>
                                    <Avatar.Text 
                                        size={40} 
                                        label={event.creator.username?.substring(0, 2).toUpperCase()}
                                        style={styles.avatar}
                                    />
                                    <View style={styles.creatorInfo}>
                                        <Text style={styles.creatorName}>{event.creator.username}</Text>
                                        <Text style={styles.creatorEmail}>{event.creator.email}</Text>
                                    </View>
                                </View>
                            </Card.Content>
                        </Card>
                    )}

                    {/* Project & Clan Section */}
                    <Card style={[styles.section, styles.associatedSection]}>
                        <Card.Content>
                            <Title style={styles.sectionTitle}>Associated With</Title>
                            {event.project && (
                                <View style={styles.associationItem}>
                                    <MaterialIcons name="business" size={24} color={'#4F46E5'} />
                                    <Text style={styles.associationText}>
                                        Project: {event.project.projectName}
                                    </Text>
                                </View>
                            )}
                            {event.clan && (
                                <View style={styles.associationItem}>
                                    <MaterialIcons name="group" size={24} color={'#4F46E5'} />
                                    <Text style={styles.associationText}>
                                        Clan: {event.clan.name}
                                    </Text>
                                </View>
                            )}
                        </Card.Content>
                    </Card>

                    {/* Participants Section */}
                    {event.participants && event.participants.length > 0 && (
                        <Card style={[styles.section, styles.lastSection]}>
                            <Card.Content>
                                <Title style={styles.sectionTitle}>Participants</Title>
                                <View style={styles.participantsContainer}>
                                    {event.participants.map((userEvent, index) => (
                                        <View key={index} style={styles.participantItem}>
                                            <Avatar.Text 
                                                size={40} 
                                                label={userEvent.user.name.substring(0, 2).toUpperCase()}
                                                style={styles.avatar}
                                            />
                                            <View style={styles.participantInfo}>
                                                <Text style={styles.participantName}>
                                                    {userEvent.user.name}
                                                </Text>
                                                <Text style={styles.participantEmail}>
                                                    {userEvent.user.email}
                                                </Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </Card.Content>
                        </Card>
                    )}
                </ScrollView>

                <Button 
                    mode="contained" 
                    onPress={onDismiss}
                    textColor="white"
                    style={styles.closeButton}
                >
                    Close
                </Button>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: 'white',
        margin: 20,
        padding: 20,
        borderRadius: 15,
        maxHeight: '90%',
    },
    contentWrapper: {
        flex: 1,
        position: 'relative',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 80,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 10,
        color: 'black'
    },
    statusBadge: {
        paddingHorizontal: 10,
    },
    section: {
        marginBottom: 15,
        elevation: 2,
        backgroundColor: '#EEE'
    },
    associatedSection: {
        marginBottom: 80,
    },
    lastSection: {
        marginBottom: 60,
    },
    sectionTitle: {
        fontSize: 18,
        marginBottom: 10,
        color: '#1F2937',
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#4B5563',
    },
    timeContainer: {
        gap: 15,
    },
    timeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    timeTextContainer: {
        flex: 1,
    },
    timeLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    timeValue: {
        fontSize: 16,
        color: '#1F2937',
    },
    divider: {
        marginVertical: 10,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    locationText: {
        fontSize: 16,
        color: '#4B5563',
        flex: 1,
    },
    creatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    avatar: {
        backgroundColor: '#4F46E5',
    },
    creatorInfo: {
        flex: 1,
    },
    creatorName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    creatorEmail: {
        fontSize: 14,
        color: '#6B7280',
    },
    associationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },
    associationText: {
        fontSize: 16,
        color: '#4B5563',
    },
    participantsContainer: {
        gap: 15,
    },
    participantItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    participantInfo: {
        flex: 1,
    },
    participantName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1F2937',
    },
    participantEmail: {
        fontSize: 14,
        color: '#6B7280',
    },
    closeButton: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        width: 100,
        backgroundColor: '#4F46E5',
    },
});

export default EventDetailsModal;