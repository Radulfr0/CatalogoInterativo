import React, { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { router, useFocusEffect } from "expo-router"; // Importar useFocusEffect para recarregar favoritos
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importar AsyncStorage
import { Ionicons } from "@expo/vector-icons"; // Importar Ionicons para ícones

// Tipagem dos livros
type Book = {
  key: string;
  title: string;
  cover_id?: number;
  authors?: { name: string }[];
};

const FAVORITES_KEY = "@MyApp:favorites"; // Chave para AsyncStorage, usada em todo o app

const HomeScreen = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  // Usamos um Set para verificar rapidamente se um livro é favorito (melhor performance para listas grandes)
  const [favoriteBooksKeys, setFavoriteBooksKeys] = useState<Set<string>>(
    new Set()
  );

  // Função para carregar as chaves dos livros favoritados do AsyncStorage
  const loadFavorites = useCallback(async () => {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      if (favorites) {
        const parsedFavorites: Book[] = JSON.parse(favorites);
        // Mapeia os favoritos para um Set de suas chaves para fácil lookup
        setFavoriteBooksKeys(new Set(parsedFavorites.map((book) => book.key)));
      } else {
        setFavoriteBooksKeys(new Set()); // Garante que esteja vazio se não houver favoritos
      }
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    }
  }, []); // Dependência vazia, pois não depende de nenhum estado externo

  // Usa useFocusEffect para carregar/recarregar os favoritos sempre que a tela HomeScreen for focada.
  // Isso garante que os ícones de coração estejam atualizados se o status de favorito for alterado em DetalhesScreen ou FavoritesScreen.
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
      return () => {
        // Nenhuma limpeza específica necessária aqui para este caso.
      };
    }, [loadFavorites]) // Recarrega sempre que a função loadFavorites for atualizada (embora useCallback a estabilize)
  );

  // Função para buscar os livros da API
  const fetchBooks = async () => {
    try {
      const response = await fetch(
        "https://openlibrary.org/subjects/science_fiction.json?limit=25"
      );
      const json = await response.json();
      setBooks(json.works || []);
    } catch (error) {
      console.error("Error fetching books:", error);
      Alert.alert("Erro", "Não foi possível carregar a lista de livros.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []); // Executa apenas uma vez ao montar o componente

  // Função para navegar para a tela de detalhes do livro
  function handleNavigateDetalhes(book: Book) {
    router.navigate({
      pathname: "/detalhes", // Verifique se o nome da rota está correto (deve ser o mesmo que o arquivo DetalhesScreen.tsx)
      params: { book: JSON.stringify(book) },
    });
  }

  // Função para adicionar ou remover um livro dos favoritos
  const toggleFavorite = useCallback(
    async (book: Book) => {
      try {
        const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
        let parsedFavorites: Book[] = favorites ? JSON.parse(favorites) : [];
        const isCurrentlyFavorite = favoriteBooksKeys.has(book.key);

        if (isCurrentlyFavorite) {
          // Se já for favorito, remove-o da lista
          parsedFavorites = parsedFavorites.filter(
            (favBook) => favBook.key !== book.key
          );
          Alert.alert("Sucesso", `"${book.title}" removido dos favoritos.`);
        } else {
          // Se não for favorito, adiciona-o à lista
          parsedFavorites.push(book);
          Alert.alert("Sucesso", `"${book.title}" adicionado aos favoritos!`);
        }
        // Salva a lista atualizada de volta no AsyncStorage
        await AsyncStorage.setItem(
          FAVORITES_KEY,
          JSON.stringify(parsedFavorites)
        );
        // Atualiza o Set de chaves favoritas para re-renderizar a FlatList com o ícone correto
        setFavoriteBooksKeys(
          new Set(parsedFavorites.map((favBook) => favBook.key))
        );
      } catch (error) {
        console.error("Erro ao alternar favorito:", error);
        Alert.alert("Erro", "Não foi possível atualizar seus favoritos.");
      }
    },
    [favoriteBooksKeys]
  ); // Depende de favoriteBooksKeys para que a função tenha acesso ao estado mais recente

  // Função para navegar para a tela de livros favoritos
  const navigateToFavorites = () => {
    router.push("/FavoritesScreen"); // Verifique se o nome da rota está correto (deve ser o mesmo que o arquivo favoritesScreen.tsx)
  };

  // Renderiza cada item da lista de livros
  const renderItem = ({ item }: { item: Book }) => {
    const coverId = item.cover_id;
    const imageUrl = coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
      : "https://via.placeholder.com/100x150.png?text=No+Image";

    // Verifica se o livro atual está no Set de chaves favoritas para determinar o ícone
    const isFavorite = favoriteBooksKeys.has(item.key);

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => handleNavigateDetalhes(item)}
      >
        <Image source={{ uri: imageUrl }} style={styles.coverImage} />
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          {item.authors && item.authors.length > 0 && (
            <Text style={styles.author} numberOfLines={1}>
              {item.authors.map((author) => author.name).join(", ")}
            </Text>
          )}
        </View>
        {/* Botão de Favoritar por item */}
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation(); // Impede que o clique no coração acione a navegação para detalhes do livro
            toggleFavorite(item); // Chama a função para alternar o status de favorito
          }}
          style={styles.favoriteButtonPerItem}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"} // Ícone de coração preenchido ou contorno
            size={24}
            color={isFavorite ? "#e74c3c" : "#bdc3c7"} // Cor vermelha para favorito, cinza para não favorito
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4682B4" />
        <Text style={styles.loadingText}>Carregando livros...</Text>
      </View>
    );
  }

  if (!loading && books.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Nenhum livro encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Livros de Ficção Científica</Text>
        {/* Botão Geral para Ver Favoritos */}
        <TouchableOpacity
          style={styles.viewFavoritesButton}
          onPress={navigateToFavorites}
        >
          <Ionicons name="bookmark-outline" size={24} color="#FFF" />
          <Text style={styles.viewFavoritesButtonText}>Favoritos</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={books}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F9FF",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1E3A8A",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#293d09",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#4682B4",
  },
  listContent: {
    paddingBottom: 30,
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  coverImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: "#dfe6e9",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E3A8A",
  },
  author: {
    marginTop: 4,
    fontSize: 14,
    color: "#93C5FD",
    fontStyle: "italic",
  },
  // Adicione estes estilos:
  viewFavoritesButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  viewFavoritesButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },
  favoriteButtonPerItem: {
    marginLeft: 10,
    padding: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
});
export default HomeScreen;