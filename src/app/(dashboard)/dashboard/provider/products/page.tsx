"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Edit2,
  Trash2,
  Package,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle2,
  MapPin,
  Save,
  X,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { providerApi } from "@/api/providerApi";
import { ErrorState } from "@/components/shared/ErrorState";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { ProviderProductsEmptyState } from "@/components/provider/ProviderEmptyStates";

// --- Interface ---
interface Product {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  thumbnail: string;
  category: {
    name?: string;
    title?: string;
    slug: string;
  };
  provider: {
    name?: string;
  };
  rating: {
    average?: number;
    totalReviews?: number;
  };
  availability: {
    stock?: number;
    status?: string;
    isAvailable?: boolean;
  };
  foodInfo: {
    calories?: number;
  };
}
