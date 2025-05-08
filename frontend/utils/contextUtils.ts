/**
 * Utility functions for working with the application context
 * This allows any component to access the selected event context
 */

// Type definition for the context data
export interface ContextData {
  selectedEvent: Event | null;
  lastUpdated: string;
}

// Type definition for events
export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  url: string;
  keywords: string[];
}

/**
 * Get the current context from the API
 * @returns The current context data
 */
export async function getContext(): Promise<ContextData> {
  try {
    const response = await fetch('/api/context');
    
    if (!response.ok) {
      throw new Error('Failed to fetch context');
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching context:', error);
    // Return default context if fetch fails
    return {
      selectedEvent: null,
      lastUpdated: new Date().toISOString()
    };
  }
}

/**
 * Update the context with a selected event
 * @param event The event to set as the selected event
 * @returns The updated context data
 */
export async function setSelectedEvent(event: Event | null): Promise<ContextData> {
  try {
    const response = await fetch('/api/context', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ selectedEvent: event }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update context');
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error updating context:', error);
    throw error;
  }
}

/**
 * Clear the current context
 * @returns A success message
 */
export async function clearContext(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/context', {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to clear context');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error clearing context:', error);
    throw error;
  }
}
