import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// 1. Importar o hook 'router' do expo-router
import { router } from "expo-router";

// Tipagem dos livros
type Book = {
  key: string;
  title: string;
  cover_id?: number;
  authors?: { name: string }[];
};

const HomeScreen = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const response = await fetch(
        'https://openlibrary.org/subjects/science_fiction.json?limit=25'
      );
      const json = await response.json();
      setBooks(json.works || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // 2. Função para navegar para detalhes usando router.navigate
  function handleNavigateDetalhes(book: Book) {
    // 3. Passa o objeto como parâmetro de rota
    router.navigate({
      pathname: "/detalhes",
      params: { book: JSON.stringify(book) }
    });
  }

  const renderItem = ({ item }: { item: Book }) => {
    const coverId = item.cover_id;
    const imageUrl = coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
      : 'https://via.placeholder.com/100x150.png?text=No+Image';

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
              {item.authors.map((author) => author.name).join(', ')}
            </Text>
          )}
        </View>
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
      <Text style={styles.header}>Livros de Ficção Científica</Text>
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
    backgroundColor: '#293d09',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 16,
    color: '#99D64D',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#293d09',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#4682B4',
  },
  listContent: {
    paddingBottom: 30,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#76993d',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    alignItems: 'center',
    shadowColor: '#000',
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
    backgroundColor: '#dfe6e9',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  author: {
    marginTop: 4,
    fontSize: 14,
    color: '#2e2e2e',
    fontStyle: 'italic',
  },
});

export default HomeScreen;