
import User from "./User";
import Property from "./Property";
import Inquiry from "./Inquiry";

User.hasMany(Property, { foreignKey: "userId", as: "properties" });
Property.belongsTo(User, { foreignKey: "userId", as: "owner" });

User.hasMany(Inquiry, { foreignKey: "userId", as: "sentInquiries" });
Inquiry.belongsTo(User, { foreignKey: "userId", as: "sender" });

Property.hasMany(Inquiry, { foreignKey: "propertyId", as: "inquiries" });
Inquiry.belongsTo(Property, { foreignKey: "propertyId", as: "property" });

User.hasMany(Inquiry, { foreignKey: "ownerId", as: "receivedInquiries" });
Inquiry.belongsTo(User, { foreignKey: "ownerId", as: "ownerUser" });

export { User, Property, Inquiry };
