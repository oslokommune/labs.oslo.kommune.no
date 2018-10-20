exports.getServerName = function () {
  // You set servername in config/system.properties with the key xp.name
  return Java.type('com.enonic.xp.server.ServerInfo').get().getName();
};
