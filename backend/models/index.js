const User = require('./User');
const Trip = require('./Trip');
const City = require('./City');
const Activity = require('./Activity');
const SharedTrip = require('./SharedTrip');
const TripCollaborator = require('./TripCollaborator');
const BudgetItem = require('./BudgetItem');
const TripComment = require('./TripComment');
const UserProfile = require('./UserProfile');
const UserGroup = require('./UserGroup');
const GroupMember = require('./GroupMember');
const Chat = require('./Chat');
const ChatParticipant = require('./ChatParticipant');
const Message = require('./Message');
const Story = require('./Story');
const Post = require('./Post');
const PostComment = require('./PostComment');
const UserFollow = require('./UserFollow');

// User-Trip associations
User.hasMany(Trip, { foreignKey: 'userId', as: 'trips' });
Trip.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Trip-City associations
Trip.hasMany(City, { foreignKey: 'tripId', as: 'cities' });
City.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip' });

// City-Activity associations
City.hasMany(Activity, { foreignKey: 'cityId', as: 'activities' });
Activity.belongsTo(City, { foreignKey: 'cityId', as: 'city' });

// Trip-SharedTrip associations
Trip.hasOne(SharedTrip, { foreignKey: 'tripId', as: 'sharedTrip' });
SharedTrip.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip' });

// Trip-Collaborator associations
Trip.hasMany(TripCollaborator, { foreignKey: 'tripId', as: 'collaborators' });
TripCollaborator.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip' });
User.hasMany(TripCollaborator, { foreignKey: 'userId', as: 'collaborations' });
TripCollaborator.belongsTo(User, { foreignKey: 'userId', as: 'user' });
TripCollaborator.belongsTo(User, { foreignKey: 'invitedBy', as: 'inviter' });

// Trip-BudgetItem associations
Trip.hasMany(BudgetItem, { foreignKey: 'tripId', as: 'budgetItems' });
BudgetItem.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip' });
User.hasMany(BudgetItem, { foreignKey: 'userId', as: 'budgetItems' });
BudgetItem.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Trip-Comment associations
Trip.hasMany(TripComment, { foreignKey: 'tripId', as: 'comments' });
TripComment.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip' });
User.hasMany(TripComment, { foreignKey: 'userId', as: 'comments' });
TripComment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Self-referencing for comment replies
TripComment.hasMany(TripComment, { foreignKey: 'parentId', as: 'replies' });
TripComment.belongsTo(TripComment, { foreignKey: 'parentId', as: 'parent' });

// User-Profile associations
User.hasOne(UserProfile, { foreignKey: 'userId', as: 'profile' });
UserProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User-Follow associations
User.hasMany(UserFollow, { foreignKey: 'followerId', as: 'following' });
User.hasMany(UserFollow, { foreignKey: 'followingId', as: 'followers' });
UserFollow.belongsTo(User, { foreignKey: 'followerId', as: 'follower' });
UserFollow.belongsTo(User, { foreignKey: 'followingId', as: 'following' });

// Group associations
User.hasMany(UserGroup, { foreignKey: 'createdBy', as: 'createdGroups' });
UserGroup.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
UserGroup.hasMany(GroupMember, { foreignKey: 'groupId', as: 'members' });
GroupMember.belongsTo(UserGroup, { foreignKey: 'groupId', as: 'group' });
GroupMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(GroupMember, { foreignKey: 'userId', as: 'groupMemberships' });

// Chat associations
Chat.hasMany(ChatParticipant, { foreignKey: 'chatId', as: 'participants' });
ChatParticipant.belongsTo(Chat, { foreignKey: 'chatId', as: 'chat' });
ChatParticipant.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(ChatParticipant, { foreignKey: 'userId', as: 'chats' });
Chat.belongsTo(UserGroup, { foreignKey: 'groupId', as: 'group' });

// Message associations
Chat.hasMany(Message, { foreignKey: 'chatId', as: 'messages' });
Message.belongsTo(Chat, { foreignKey: 'chatId', as: 'chat' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
Message.hasMany(Message, { foreignKey: 'replyToId', as: 'replies' });
Message.belongsTo(Message, { foreignKey: 'replyToId', as: 'replyTo' });

// Story associations
User.hasMany(Story, { foreignKey: 'userId', as: 'stories' });
Story.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Story.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip' });

// Post associations
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Post.belongsTo(UserGroup, { foreignKey: 'groupId', as: 'group' });
Post.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip' });
Post.hasMany(PostComment, { foreignKey: 'postId', as: 'comments' });
PostComment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });
PostComment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
PostComment.hasMany(PostComment, { foreignKey: 'parentId', as: 'replies' });
PostComment.belongsTo(PostComment, { foreignKey: 'parentId', as: 'parent' });

module.exports = {
  User,
  Trip,
  City,
  Activity,
  SharedTrip,
  TripCollaborator,
  BudgetItem,
  TripComment,
  UserProfile,
  UserGroup,
  GroupMember,
  Chat,
  ChatParticipant,
  Message,
  Story,
  Post,
  PostComment,
  UserFollow
};