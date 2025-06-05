import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text } from 'react-native';

// Tipagem para os parâmetros da rota "Detalhes"
type RootStackParamList = {
  Detalhes: { book: Book };
};

// Tipagem do livro (apenas para referência na tela de detalhes)
type Book = {
  key: string;
  title: string;
  cover_id?: number;
  authors?: { name: string }[];
};

type DetalhesScreenRouteProp = RouteProp<RootStackParamList, 'Detalhes'>;

const DetalhesScreen = () => {
  const route = useRoute<DetalhesScreenRouteProp>();
  const { book } = route.params;

  const coverId = book.cover_id;
  const imageUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` // Usando 'L' para uma imagem maior
    : 'https://via.placeholder.com/200x300.png?text=No+Image';

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.coverImage} />
      <Text style={styles.title}>{book.title}</Text>
      {book.authors && book.authors.length > 0 && (
        <Text style={styles.author}>
          Autor(es): {book.authors.map((author) => author.name).join(', ')}
        </Text>
      )}
      {/* Você pode adicionar mais detalhes do livro aqui, como a descrição */}
      <Text style={styles.description}>
        Essa é a página de detalhes do livro {book.title}.
        Aqui você pode adicionar mais informações sobre o livro, como uma descrição completa,
        o ano de publicação, etc., se a API Open Library fornecer esses dados.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
  coverImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#dfe6e9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  author: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
    textAlign: 'justify',
  },
});

export default DetalhesScreen;