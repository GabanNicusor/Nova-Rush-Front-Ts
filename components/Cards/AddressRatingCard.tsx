import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet
} from 'react-native';
import handleRemoveAddress from '../../utils/handleRemoveAddress';


import Icon from 'react-native-vector-icons/FontAwesome';

import { AppDispatch } from '../../state/store';
import { ReviewType } from '../../types/enums/ReviewType'; // Import the Enum
import { CustomAddressDetailsItem } from '../../types/AddressDetails/CustomAddressDetails';
import {useAppDispatch} from '../../state/store'
// --- Type Definitions ---

interface AddressRatingCardProps {
  // 1. Fix TS2322: Use ReviewType instead of local VoteCategory
  handleVote: (vote: ReviewType) => void;

  // 2. Fix TS2741: Use your CustomAddressDetailsItem type directly.
  // We add 'selectedVote' as optional (?) so it doesn't complain if it's missing from the DB.
  item: CustomAddressDetailsItem & { selectedVote?: ReviewType | null };

  dispatch: AppDispatch;
  addressListId: string;
}

// ---

const AddressRatingCard: React.FC<AddressRatingCardProps> = ({
  handleVote,
  item,
  addressListId,
}) => {
  // Helper to check selection against the Enum values
  const isSelected = (vote: ReviewType): boolean => item.selectedVote === vote;
  const dispatch = useAppDispatch();
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Is it safe to deliver here?</Text>

      {/* --- Voting Mechanism --- */}
      <View style={styles.ratingContainer}>
        {/* Safe Place */}
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

        {/* Neutral Place */}
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

        {/* Unsafe Place */}
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

      {/* --- Remove Button --- */}
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() =>
          handleRemoveAddress(item.address_id, addressListId, dispatch)
        }
      >
        <Text style={styles.removeButtonText}>Remove Stop</Text>
        <Icon name="trash" size={20} color="#d9534f" />
      </TouchableOpacity>
    </View>
  );
};

export default AddressRatingCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
  good: { color: '#28a745' },
  neutral: { color: '#ffc107' },
  bad: { color: '#dc3545' },
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
    fontSize: 18,
    fontWeight: '600',
    color: '#d9534f',
    marginRight: 10,
  },
});
