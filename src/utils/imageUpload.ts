import { supabase, isSupabaseConfigured } from '../api/supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

// Helper function to upload image to Supabase Storage
export const uploadDonationImage = async (
  userId: string,
  imageUri: string,
  fileName: string
): Promise<string | null> => {
  try {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured');
      return null;
    }

    console.log('📤 Starting image upload to Supabase...');
    console.log('Image URI:', imageUri);

    // For React Native, we need to read the file as base64 first
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log('Base64 string length:', base64.length);

    // Convert base64 to ArrayBuffer using base64-arraybuffer
    const arrayBuffer = decode(base64);

    console.log('ArrayBuffer created, size:', arrayBuffer.byteLength);

    // Create unique file path: userId/timestamp_fileName
    const timestamp = Date.now();
    const filePath = `${userId}/${timestamp}_${fileName}`;

    console.log('Uploading to path:', filePath);

    // Upload to Supabase Storage using ArrayBuffer directly
    const { data, error } = await supabase.storage
      .from('donation-images')
      .upload(filePath, arrayBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (error) {
      console.error('❌ Supabase upload error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return null;
    }

    console.log('✅ Upload successful, path:', data.path);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('donation-images')
      .getPublicUrl(data.path);

    console.log('Public URL:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('❌ Image upload error:', error);
    return null;
  }
};

// Helper function to delete image from Supabase Storage
export const deleteDonationImage = async (imageUrl: string): Promise<boolean> => {
  try {
    if (!isSupabaseConfigured()) {
      return false;
    }

    // Extract file path from URL
    const urlParts = imageUrl.split('/donation-images/');
    if (urlParts.length < 2) {
      console.error('Invalid image URL');
      return false;
    }

    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from('donation-images')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Image deletion error:', error);
    return false;
  }
};

// Helper function to upload multiple images
export const uploadMultipleImages = async (
  userId: string,
  imageUris: string[]
): Promise<string[]> => {
  const uploadPromises = imageUris.map((uri, index) => {
    const fileName = `image_${index}.jpg`;
    return uploadDonationImage(userId, uri, fileName);
  });

  const results = await Promise.all(uploadPromises);
  return results.filter((url): url is string => url !== null);
};
