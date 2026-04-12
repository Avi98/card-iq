package expo.modules.smsreader

import android.Manifest
import android.content.ContentResolver
import android.database.Cursor
import android.net.Uri
import android.os.Bundle
import expo.modules.interfaces.permissions.Permissions
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class SmsReaderModule : Module() {

  private val context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

  override fun definition() = ModuleDefinition {

    Name("ExpoSmsReader")

    // Returns current READ_SMS permission status without showing a dialog.
    AsyncFunction("getPermissionsAsync") { promise: Promise ->
      Permissions.getPermissionsWithPermissionsManager(
        appContext.permissions,
        promise,
        Manifest.permission.READ_SMS
      )
    }

    // Shows the system permission dialog for READ_SMS.
    AsyncFunction("requestPermissionsAsync") { promise: Promise ->
      Permissions.askForPermissionsWithPermissionsManager(
        appContext.permissions,
        promise,
        Manifest.permission.READ_SMS
      )
    }

    // Queries the SMS inbox content provider.
    // maxCount:         max number of messages to return (default 50)
    // afterTimestampMs: only return messages newer than this epoch ms (0 = no filter)
    AsyncFunction("getSmsMessagesAsync") { maxCount: Int, afterTimestampMs: Double ->

      if (appContext.permissions?.hasGrantedPermissions(Manifest.permission.READ_SMS) != true) {
        throw Exceptions.MissingPermissions(Manifest.permission.READ_SMS)
      }

      val cr: ContentResolver = context.contentResolver
      val uri = Uri.parse("content://sms/inbox")

      val selection: String?
      val selectionArgs: Array<String>?
      if (afterTimestampMs > 0.0) {
        selection = "date > ?"
        selectionArgs = arrayOf(afterTimestampMs.toLong().toString())
      } else {
        selection = null
        selectionArgs = null
      }

      val projection = arrayOf("_id", "address", "body", "date", "read")
      // LIMIT is a SQLite extension supported by the AOSP SMS provider.
      val sortOrder = "date DESC LIMIT $maxCount"

      val results = mutableListOf<Bundle>()

      val cursor: Cursor? = cr.query(uri, projection, selection, selectionArgs, sortOrder)
      cursor?.use { c ->
        val idIdx      = c.getColumnIndex("_id")
        val addressIdx = c.getColumnIndex("address")
        val bodyIdx    = c.getColumnIndex("body")
        val dateIdx    = c.getColumnIndex("date")
        val readIdx    = c.getColumnIndex("read")

        while (c.moveToNext()) {
          results.add(Bundle().apply {
            // id as String to avoid JS Number precision issues with large integers
            putString("id",      c.getString(idIdx))
            putString("address", c.getString(addressIdx))
            putString("body",    c.getString(bodyIdx))
            // date as Double (53-bit precision is safe for timestamps until year 2255)
            putDouble("date",    c.getLong(dateIdx).toDouble())
            putBoolean("read",   c.getInt(readIdx) == 1)
          })
        }
      }

      results
    }
  }
}
