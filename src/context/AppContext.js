"use client";

import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import artworksData from "@/data/artworks";
import reviewsData from "@/data/reviews";
import artistsData from "@/data/artists";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [artworks, setArtworks] = useState(artworksData);
  const [reviews, setReviews] = useState(reviewsData);
  const [customArtists, setCustomArtists] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Load saved state from LocalStorage on mount if available
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("artbox_currentUser");
      const savedArtists = localStorage.getItem("artbox_customArtists");
      const savedArtworks = localStorage.getItem("artbox_customArtworks");

      if (savedUser) setCurrentUser(JSON.parse(savedUser));
      if (savedArtists) setCustomArtists(JSON.parse(savedArtists));
      if (savedArtworks) {
        const parsed = JSON.parse(savedArtworks);
        setArtworks((prev) => [...parsed, ...prev]);
      }
    } catch (e) {
      console.error("LocalStorage load error:", e);
    }
  }, []);

  const addReview = useCallback((artId, { author, title, body, rating }) => {
    const newReview = {
      id: `rev-user-${Date.now()}`,
      artId,
      author: author || (currentUser ? currentUser.name : "Anonymous"),
      rating,
      title,
      body,
      date: new Date().toISOString().split("T")[0],
      likes: 0,
      liked: false,
      isNew: true,
    };
    setReviews((prev) => [newReview, ...prev]);
    addToast("Review submitted successfully!", "success");
    return newReview;
  }, [currentUser]);

  const toggleLike = useCallback((reviewId) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              liked: !review.liked,
              likes: review.liked ? review.likes - 1 : review.likes + 1,
            }
          : review
      )
    );
  }, []);

  const addArtwork = useCallback((newArt) => {
    const artObj = {
      id: newArt.id || `art-${Date.now()}`,
      title: newArt.title || "Untitled Masterpiece",
      artist: newArt.artist || (currentUser ? currentUser.name : "Anonymous Artist"),
      year: newArt.year || new Date().getFullYear(),
      medium: newArt.medium || "Oil on Canvas",
      dimensions: newArt.dimensions || "60 cm × 80 cm",
      movement: newArt.movement || "Contemporary",
      museum: newArt.museum || "Private Collection",
      description: newArt.description || "A breathtaking original artwork created by the artist.",
      image: newArt.image || "/images/artworks/starry-night.jpg",
      gradient: "linear-gradient(135deg, #1f1d19, #2b2a27)",
      tags: newArt.tags || ["contemporary", "original", "featured"],
      featured: true,
    };

    setArtworks((prev) => [artObj, ...prev]);

    // Save to LocalStorage
    try {
      const existing = JSON.parse(localStorage.getItem("artbox_customArtworks") || "[]");
      localStorage.setItem("artbox_customArtworks", JSON.stringify([artObj, ...existing]));
    } catch (e) {
      console.error("Failed to save artwork:", e);
    }

    addToast(`"${artObj.title}" published to Gallery!`, "success");
    return artObj;
  }, [currentUser]);

  const createArtistAccount = useCallback((artistData, initialArtwork) => {
    const slug = artistData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newArtist = {
      id: slug,
      name: artistData.name,
      handle: artistData.handle || `@${slug.replace(/-/g, "_")}`,
      avatar: artistData.avatar || "/images/artworks/starry-night.jpg",
      cover: artistData.cover || "/images/hero-bg.jpg",
      verified: true,
      movement: artistData.movement || "Contemporary Art",
      followers: "1 (New)",
      following: "0",
      avgRating: 5.0,
      bio: artistData.bio || "Passionate artist creating original works and sharing visual perspectives with the ArtBox gallery community.",
      tags: artistData.tags || [artistData.movement || "Contemporary", "Original Art", "Oil on Canvas"],
      location: artistData.location || "International Studio",
    };

    setCustomArtists((prev) => [newArtist, ...prev]);
    setCurrentUser(newArtist);

    // Save to LocalStorage
    try {
      const existingArtists = JSON.parse(localStorage.getItem("artbox_customArtists") || "[]");
      localStorage.setItem("artbox_customArtists", JSON.stringify([newArtist, ...existingArtists]));
      localStorage.setItem("artbox_currentUser", JSON.stringify(newArtist));
    } catch (e) {
      console.error("Failed to save artist:", e);
    }

    // Submit initial artwork if provided
    if (initialArtwork) {
      addArtwork({
        ...initialArtwork,
        artist: newArtist.name,
      });
    }

    addToast(`Welcome to ArtBox, ${newArtist.name}! Account created.`, "success");
    return newArtist;
  }, [addArtwork]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    try {
      localStorage.removeItem("artbox_currentUser");
    } catch (e) {}
    addToast("Logged out successfully.", "info");
  }, []);

  const getArtById = useCallback(
    (id) => {
      return artworks.find((art) => art.id === id) || null;
    },
    [artworks]
  );

  const getReviewsByArt = useCallback(
    (artId) => {
      return reviews
        .filter((review) => review.artId === artId)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    [reviews]
  );

  const getAverageRating = useCallback(
    (artId) => {
      const artReviews = reviews.filter((r) => r.artId === artId);
      if (artReviews.length === 0) return 0;
      const sum = artReviews.reduce((acc, r) => acc + r.rating, 0);
      return Math.round((sum / artReviews.length) * 10) / 10;
    },
    [reviews]
  );

  const getRatingDistribution = useCallback(
    (artId) => {
      const artReviews = reviews.filter((r) => r.artId === artId);
      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      artReviews.forEach((r) => {
        distribution[r.rating] = (distribution[r.rating] || 0) + 1;
      });
      return { distribution, total: artReviews.length };
    },
    [reviews]
  );

  const getStats = useCallback(() => {
    const totalArtworks = artworks.length;
    const totalReviews = reviews.length;
    const avgRating =
      reviews.length > 0
        ? Math.round(
            (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) *
              10
          ) / 10
        : 0;
    return { totalArtworks, totalReviews, avgRating };
  }, [artworks, reviews]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      artworks,
      reviews,
      customArtists,
      currentUser,
      toasts,
      addReview,
      toggleLike,
      addArtwork,
      createArtistAccount,
      logout,
      getArtById,
      getReviewsByArt,
      getAverageRating,
      getRatingDistribution,
      getStats,
      addToast,
      removeToast,
    }),
    [
      artworks,
      reviews,
      customArtists,
      currentUser,
      toasts,
      addReview,
      toggleLike,
      addArtwork,
      createArtistAccount,
      logout,
      getArtById,
      getReviewsByArt,
      getAverageRating,
      getRatingDistribution,
      getStats,
      addToast,
      removeToast,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
