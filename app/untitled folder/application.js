// import DS from'ember-data';

// DS.attr.transforms.object = {
//   from: function(serialized) {
//     return Em.none(serialized) ? {} : serialized;
//   },
//   to: function(deserialized) {
//     return Em.none(deserialized) ? {} : deserialized;
//   }
// }

// IT changed FROM THIS:

// DS.attr.transforms.object = {
//   from: function(serialized) {
//     return Em.none(serialized) ? {} : serialized;
//   },
//   to: function(deserialized) {
//     return Em.none(deserialized) ? {} : deserialized;
//   }
// }
// TO THIS:

// DS.RESTAdapter.registerTransform('object', {
//   fromJSON: function(serialized) {
//     return Em.none(serialized) ? {} : serialized;
//   },
//   toJSON: function(deserialized) {
//     return Em.none(deserialized) ? {} : deserialized;
//   }
// })

// exportdefault DS.LSSerializer.extend();