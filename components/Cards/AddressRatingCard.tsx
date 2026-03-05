import React from 'react';
import {StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import {ReviewType} from '@/types/enums/ReviewType';
import {CustomAddressDetailsItem} from '@/types/AddressDetails/CustomAddressDetails';
import {useAppDispatch} from '@/state/store'

import handleRemoveAddress from '../../utils/handleRemoveAddress';

interface IStyles {
    card: ViewStyle;
    cardTitle: TextStyle;
    ratingContainer: ViewStyle;
    emojiContainer: ViewStyle;
    emoji: TextStyle;
    good: TextStyle;
    neutral: TextStyle;
    bad: TextStyle;
    selected: ViewStyle;
    removeButton: ViewStyle;
    removeButtonText: TextStyle;
}

interface AddressRatingCardProps {
    handleVote: (vote: ReviewType) => void;
    item: CustomAddressDetailsItem & { selectedVote?: ReviewType | null };
    addressListId: string;
}


export default function AddressRatingCard({handleVote, item, addressListId}: AddressRatingCardProps) {

    const isSelected = (vote: ReviewType): boolean => item.selectedVote === vote;
    const dispatch = useAppDispatch();
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Is it safe to deliver here?</Text>

            <View style={styles.ratingContainer}>
                <TouchableOpacity
                    onPress={() => handleVote(ReviewType.safe_place_to_deliver)}
                    style={[
                        styles.emojiContainer,
                        isSelected(ReviewType.safe_place_to_deliver) && styles.selected,
                    ]}
                >
                    <Text style={[styles.emoji, styles.good]}>
                        😊 {item.safe_place_to_deliver}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() =>
                        handleVote(ReviewType.between_safe_place_and_unsafe_place)
                    }
                    style={[
                        styles.emojiContainer,
                        isSelected(ReviewType.between_safe_place_and_unsafe_place) &&
                        styles.selected,
                    ]}
                >
                    <Text style={[styles.emoji, styles.neutral]}>
                        😐 {item.between_safe_place_and_unsafe_place}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleVote(ReviewType.unsafe_place_to_deliver)}
                    style={[
                        styles.emojiContainer,
                        isSelected(ReviewType.unsafe_place_to_deliver) && styles.selected,
                    ]}
                >
                    <Text style={[styles.emoji, styles.bad]}>
                        😠 {item.unsafe_place_to_deliver}
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.removeButton}
                onPress={() =>
                    handleRemoveAddress(item.address_id, addressListId, dispatch)
                }
            >
                <Text style={styles.removeButtonText}>Remove Stop</Text>
                <Icon name="trash" size={20} color="#d9534f"/>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create<IStyles>({
    card: {

        padding: 16,

        backgroundColor: '#fff',
        borderRadius: 16,

        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,

        elevation: 3,
    },

    cardTitle: {

        marginBottom: 10,

        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },

    ratingContainer: {

        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
    },

    emojiContainer: {

        padding: 10,

        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fafafa',
    },

    emoji: {
        fontSize: 28,
    },

    good: {
        color: '#28a745',
    },

    neutral: {
        color: '#ffc107',
    },

    bad: {
        color: '#dc3545',
    },

    selected: {
        backgroundColor: '#e6f7ff',
        borderColor: '#007bff',
    },

    removeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,

        borderRadius: 12,
        backgroundColor: '#ffebee',
        borderWidth: 1,
        borderColor: '#d9534f',
    },

    removeButtonText: {
        marginRight: 10,

        fontSize: 18,
        fontWeight: '600',
        color: '#d9534f',
    },
});
